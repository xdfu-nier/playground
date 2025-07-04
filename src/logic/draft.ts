import { file } from 'jszip'
import { Orchestrator } from '~/orchestrator'
export const saveDraft = (name: String | undefined, draft: Orchestrator) => {
    localStorage.setItem(`hako-draft-${name}`, JSON.stringify({files: draft.files, packages: draft.packages}))
}

export const loadDraft = (name: String | undefined) => {
    return JSON.parse(localStorage.getItem(`hako-draft-${name}`) || '{}')
}