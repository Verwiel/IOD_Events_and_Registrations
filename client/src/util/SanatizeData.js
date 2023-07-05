import * as DOMPurify from 'dompurify'

export const sanitizeData = (dirtyData) => {
    let cleanData = DOMPurify.sanitize(dirtyData)
    cleanData = cleanData.replace(/&amp;/g,'&')
    return cleanData
}

