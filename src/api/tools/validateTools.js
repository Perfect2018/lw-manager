const reg_mobile = /(^1[3|4|5|7|8][0-9]{9}$)/;//手机号码校验
const reg_number = /^[1-9]{1}[0-9]*$/;//正整数校验（开头不能为0）
const validatePhone = (phone) => {
    return reg_mobile.test(phone);
}
const validateNumber = (number) => {
    return reg_number.test(number);
}
export default {
    validatePhone,
    validateNumber
}