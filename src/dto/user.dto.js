class UserDTO {
    constructor(usuario) {
        this.email = usuario.email;
        this.first_name = usuario.first_name;
        this.role = usuario.role;
        }
    }
    
    export default UserDTO;