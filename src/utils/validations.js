module.exports = {
    required: {
        rule: value => {
            return value
        },
        hint: value => {
            return <span>Required</span>
        }
    }
};