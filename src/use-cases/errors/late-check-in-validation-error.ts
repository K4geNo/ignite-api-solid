export class LateCheckInValidationError extends Error {
    constructor() {
        super('Check-in is too late to be validated')
    }
}
