export interface IToken {
  _id: string;
  role: 'admin' | 'user';
  name: string;
  iat?: number;
  exp?: number;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IRegisterData {
  name: string;
  email: string;
  password: string;
}

export interface IAuthResponse {
  status: string;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: 'admin' | 'user';
    };
  };
}

