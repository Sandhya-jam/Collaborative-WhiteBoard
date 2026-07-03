export const saveUser=(data)=>{
    localStorage.setItem("token",data.token);
    localStorage.setItem("user",JSON.stringify(data))
};

export const getUser=()=>{
    return JSON.parse(localStorage.getItem("user"));
};

export const getToken=()=>{
    return localStorage.getItem("token")
};

export const logout=()=>{
    localStorage.clear();
}
 