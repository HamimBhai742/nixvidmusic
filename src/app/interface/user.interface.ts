
export interface UserPayload {
    name: string;
    email: string;
    password: string;
}

export interface IJwtPayload {
    userId: string;
    name: string;
    email: string;
    role: string;
}