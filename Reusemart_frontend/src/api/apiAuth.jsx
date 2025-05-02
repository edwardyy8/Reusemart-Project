import useAxios from ".";

const SignUp = async (data) => {
    try {
        
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });
         
        const response = await useAxios.post("/register", formData); 
        
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
const SignIn = async (data) => {
    try {
        const response = await useAxios.post("/login", data); return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const LogOut = async () => {
    try {
        const response = await useAxios.post("/logout", {},
            { headers: 
                { 
                    Authorization: `Bearer ${sessionStorage.getItem("token")}` 
                } 
            },
        ); 
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

const getRole = async () => {
    try {
        const response = await useAxios.get("/getrole",
            { headers: 
                { 
                    Authorization: `Bearer ${sessionStorage.getItem("token")}` 
                } 
            }
        ); 
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

const getJabatan = async () => {
    try {
        const response = await useAxios.get("/getJabatan",
            { headers: 
                { 
                    Authorization: `Bearer ${sessionStorage.getItem("token")}` 
                } 
            }
        ); 
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

const forgotPassword = async (email, user_type) => {
    try{
        const response = await useAxios.post("/forgot-password", { email, user_type });
        return response.data;
    } catch (error) {
        console.log(error.response.message);
        throw error.response.data;
    }
};

const resetPassword = async (token, email, password, password_confirmation) => {
    try{
        const response = await useAxios.post("/reset-password", { token, email, password, password_confirmation });
        return response.data;
    } catch (error) {
        console.log(error.response.message);
        throw error.response.data;
    }
};
  

export { SignUp, SignIn, LogOut, getRole, getJabatan, forgotPassword, resetPassword };