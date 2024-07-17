export const isProduction = () => {
    return process.env.NODE_ENV === 'develop'
}
