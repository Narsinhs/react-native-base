export const generateKey = () => {
    return (Math.random() * Date.now()).toString();
}