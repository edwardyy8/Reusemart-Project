import useAxios from ".";

const SignUp = async (data) => {
    try {
        const response = await useAxios.post("/register", data); return response.data;
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
        const response = await useAxios.post("/logout", 
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

export { SignUp, SignIn, LogOut, getRole, getJabatan };