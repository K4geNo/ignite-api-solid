export class MaxNumberOfCheckInsError extends Error {
    constructor() {
        super('User has reached the maximum number of check-ins')
    }
}
