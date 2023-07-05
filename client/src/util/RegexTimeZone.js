export const RegexTimeZone = (timeZone) => {
    const timeZoneRegExp = /\(([^)]+)\)/
    const timeZoneDisplay = timeZoneRegExp.exec(timeZone)[1]
    return timeZoneDisplay
}
