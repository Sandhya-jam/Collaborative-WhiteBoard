export const saveUser=(data)=>{
    localStorage.setItem("token",data.token);
    localStorage.setItem("user",JSON.stringify(data))
};

export const getUser=()=>{
    const user=localStorage.getItem("user");
    return user?JSON.parse(user):null;
};

export const getToken=()=>{
    return localStorage.getItem("token")
};

export const logout=()=>{
    localStorage.clear();
}
 