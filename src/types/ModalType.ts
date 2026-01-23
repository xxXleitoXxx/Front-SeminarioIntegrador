export const ModalType = {
    NONE: "NONE",
    CREATE: "CREATE",
    UPDATE: "UPDATE",
    DELETE: "DELETE",
} as const;

export type ModalType = (typeof ModalType)[keyof typeof ModalType];
