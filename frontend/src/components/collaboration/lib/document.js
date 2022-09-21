let fDocument = null

export const getDocument = () => fDocument || window.document

export const setDocument = (document) => (fDocument = document)
