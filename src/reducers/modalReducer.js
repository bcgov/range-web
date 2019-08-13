import {
  OPEN_INPUT_MODAL,
  CLOSE_INPUT_MODAL,
  OPEN_CONFIRMATION_MODAL,
  CLOSE_CONFIRMATION_MODAL,
  OPEN_PIA_MODAL,
  CLOSE_PIA_MODAL
} from '../constants/actionTypes'

const initialState = {
  confirmModal: {},
  inputModal: null,
  isPiaModalOpen: false
}

const openConfirmModal = (state, action) => {
  const modal = action.payload
  return {
    ...state,
    confirmModal: {
      ...state.confirmModal,
      [modal.id]: modal
    }
  }
}

const closeConfirmModal = (state, action) => {
  const { modalId } = action.payload
  const newConfirmModalState = { ...state.confirmModal }
  delete newConfirmModalState[modalId]

  return {
    ...state,
    confirmModal: newConfirmModalState
  }
}

const openInputModal = (state, action) => {
  const modal = action.payload

  return {
    ...state,
    inputModal: {
      ...modal
    }
  }
}

const closeInputModal = state => {
  return {
    ...state,
    inputModal: null
  }
}

const openPiaModal = state => {
  return {
    ...state,
    isPiaModalOpen: true
  }
}

const closePiaModal = state => {
  return {
    ...state,
    isPiaModalOpen: false
  }
}

const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_CONFIRMATION_MODAL:
      return openConfirmModal(state, action)
    case CLOSE_CONFIRMATION_MODAL:
      return closeConfirmModal(state, action)
    case OPEN_INPUT_MODAL:
      return openInputModal(state, action)
    case CLOSE_INPUT_MODAL:
      return closeInputModal(state)
    case OPEN_PIA_MODAL:
      return openPiaModal(state)
    case CLOSE_PIA_MODAL:
      return closePiaModal(state)
    default:
      return state
  }
}

export const getConfirmationModalsMap = state => state.confirmModal
export const getInputModal = state => state.inputModal
export const getIsPiaModalOpen = state => state.isPiaModalOpen

export default modalReducer
