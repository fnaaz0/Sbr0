/* ==========================================
   SBR GLOBAL SUPER APP
   AUTHENTICATION ENGINE
   Version 1.0
========================================== */

const Auth = {

    version: "1.0.0",

    currentUser: null,

    users: [],

    session: null,

    config: {

        minPasswordLength: 8,

        maxLoginAttempts: 5,

        sessionTimeout: 86400000,

        rememberMe: true

    },

    init() {

        console.log("SBR Auth Engine Loading...");

        this.loadUsers();

        this.restoreSession();

        this.bindEvents();

        console.log("SBR Auth Ready");

    },

    bindEvents() {

        const loginForm=document.getElementById("loginForm");

        if(loginForm){

            loginForm.addEventListener("submit",(e)=>{

                e.preventDefault();

                this.login();

            });

        }

        const registerForm=document.getElementById("registerForm");

        if(registerForm){

            registerForm.addEventListener("submit",(e)=>{

                e.preventDefault();

                this.register();

            });

        }

    },

    loadUsers(){

        const data=localStorage.getItem("sbr_users");

        if(data){

            this.users=JSON.parse(data);

        }

    },

    saveUsers(){

        localStorage.setItem(

            "sbr_users",

            JSON.stringify(this.users)

        );

    },

    register(){

        const name=document.getElementById("name")?.value.trim();

        const email=document.getElementById("email")?.value.trim();

        const password=document.getElementById("password")?.value;

        if(!name){

            alert("Enter Name");

            return;

        }

        if(!email){

            alert("Enter Email");

            return;

        }

        if(password.length<this.config.minPasswordLength){

            alert("Password too short");

            return;

        }

        const exists=this.users.find(

            u=>u.email===email

        );

        if(exists){

            alert("User Already Exists");

            return;

        }

        const user={

            id:Date.now(),

            name:name,

            email:email,

            password:password,

            created:new Date().toISOString(),

            verified:false,

            profile:{},

            settings:{}

        };

        this.users.push(user);

        this.saveUsers();

        alert("Registration Successful");

    },

    login(){

        const email=document.getElementById("email")?.value.trim();

        const password=document.getElementById("password")?.value;

        const user=this.users.find(

            u=>u.email===email &&

            u.password===password

        );

        if(!user){

            alert("Invalid Login");

            return;

        }

        this.currentUser=user;

        this.session={

            id:Date.now(),

            email:user.email,

            login:new Date().toISOString()

        };

        localStorage.setItem(

            "sbr_session",

            JSON.stringify(this.session)

        );

        alert("Welcome "+user.name);

    },
        logout() {

        this.currentUser = null;

        this.session = null;

        localStorage.removeItem("sbr_session");

        console.log("User Logged Out");

        window.location.reload();

    },

    restoreSession() {

        const data = localStorage.getItem("sbr_session");

        if (!data) {

            return false;

        }

        this.session = JSON.parse(data);

        const user = this.users.find(

            u => u.email === this.session.email

        );

        if (user) {

            this.currentUser = user;

            console.log("Session Restored");

            return true;

        }

        return false;

    },

    isLoggedIn() {

        return this.currentUser !== null;

    },

    getCurrentUser() {

        return this.currentUser;

    },

    updateProfile(data) {

        if (!this.currentUser) {

            return false;

        }

        Object.assign(

            this.currentUser.profile,

            data

        );

        this.saveUsers();

        return true;

    },

    changePassword(oldPassword,newPassword){

        if(!this.currentUser){

            return false;

        }

        if(this.currentUser.password!==oldPassword){

            alert("Old Password Incorrect");

            return false;

        }

        if(newPassword.length<this.config.minPasswordLength){

            alert("Password Too Short");

            return false;

        }

        this.currentUser.password=newPassword;

        this.saveUsers();

        alert("Password Updated");

        return true;

    },

    forgotPassword(email){

        const user=this.users.find(

            u=>u.email===email

        );

        if(!user){

            alert("Email Not Found");

            return false;

        }

        const otp=Math.floor(

            100000+

            Math.random()*900000

        );

        localStorage.setItem(

            "sbr_reset_otp",

            otp

        );

        console.log(

            "OTP:",

            otp

        );

        alert(

            "Reset OTP Generated"

        );

        return true;

    },

    verifyOTP(code){

        const otp=localStorage.getItem(

            "sbr_reset_otp"

        );

        return otp==code;

    },

    resetPassword(email,newPassword){

        const user=this.users.find(

            u=>u.email===email

        );

        if(!user){

            return false;

        }

        user.password=newPassword;

        this.saveUsers();

        localStorage.removeItem(

            "sbr_reset_otp"

        );

        alert("Password Reset Successful");

        return true;

    },
        loginHistory: [],

    addLoginHistory(email){

        const item={

            email:email,

            time:new Date().toISOString(),

            browser:navigator.userAgent

        };

        this.loginHistory.push(item);

        localStorage.setItem(

            "sbr_login_history",

            JSON.stringify(this.loginHistory)

        );

    },

    loadLoginHistory(){

        const data=localStorage.getItem(

            "sbr_login_history"

        );

        if(data){

            this.loginHistory=JSON.parse(data);

        }

    },

    rememberUser(email){

        localStorage.setItem(

            "sbr_remember",

            email

        );

    },

    forgetUser(){

        localStorage.removeItem(

            "sbr_remember"

        );

    },

    getRememberedUser(){

        return localStorage.getItem(

            "sbr_remember"

        );

    },

    generateOTP(){

        return Math.floor(

            100000+

            Math.random()*900000

        ).toString();

    },

    sendOTP(email){

        const otp=this.generateOTP();

        localStorage.setItem(

            "sbr_email_otp",

            otp

        );

        console.log(

            "OTP Sent:",

            otp,

            email

        );

        return otp;

    },

    verifyEmailOTP(code){

        const otp=localStorage.getItem(

            "sbr_email_otp"

        );

        return otp===code;

    },

    verifyEmail(email){

        const user=this.users.find(

            u=>u.email===email

        );

        if(user){

            user.verified=true;

            this.saveUsers();

            return true;

        }

        return false;

    },

    deleteAccount(){

        if(!this.currentUser){

            return;

        }

        this.users=this.users.filter(

            u=>u.id!==this.currentUser.id

        );

        this.saveUsers();

        this.logout();

    },

    lockAccount(email){

        localStorage.setItem(

            "lock_"+email,

            "true"

        );

    },

    unlockAccount(email){

        localStorage.removeItem(

            "lock_"+email

        );

    },

    isLocked(email){

        return localStorage.getItem(

            "lock_"+email

        )==="true";

    },
        startSessionTimer() {

        if (!this.session) return;

        setTimeout(() => {

            alert("Session Expired");

            this.logout();

        }, this.config.sessionTimeout);

    },

    refreshSession() {

        if (!this.session) return;

        this.session.login = new Date().toISOString();

        localStorage.setItem(

            "sbr_session",

            JSON.stringify(this.session)

        );

    },

    getUserCount() {

        return this.users.length;

    },

    findUser(email) {

        return this.users.find(

            u => u.email === email

        );

    },

    emailExists(email) {

        return this.users.some(

            u => u.email === email

        );

    },

    exportUsers() {

        return JSON.stringify(

            this.users,

            null,

            2

        );

    },

    clearUsers() {

        this.users = [];

        localStorage.removeItem("sbr_users");

    }

};

document.addEventListener("DOMContentLoaded", () => {

    Auth.init();

});
