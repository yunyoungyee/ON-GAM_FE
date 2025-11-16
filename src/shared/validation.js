export function validationEmail(email){
    const emailRegex = /^[a-zA-Z0-9.\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}
export function validationPassword(password){
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/;
    return passwordRegex.test(password);
}
export function validationNickname(nickname){
    const nicknameRegex = /^\S{1,10}$/;
    return nicknameRegex.test(nickname);
}