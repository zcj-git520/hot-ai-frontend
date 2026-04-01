// API 响应类型定义

export interface UserInfo {
  id: string
  email: string
  nickname: string
  avatar: string
  roles: string[]
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  user: UserInfo
}

export interface RegisterRequest {
  email: string
  password: string
  nickname: string
  verification_code: string
}

export interface RegisterResponse {
  user_id: string
  message: string
}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface RefreshTokenResponse {
  access_token: string
  expires_in: number
}

export interface CommonResponse<T = any> {
  code: number
  message: string
  data: T | null
}

export interface SendRegistrationCodeResponse {
  message: string
  email: string
  expires_in: number
}

export interface UserProfile {
  id: string
  email: string
  nickname: string
  avatar: string
  bio?: string
  preferences?: {
    theme: string
    email_notifications: {
      system_update: boolean
      new_content: boolean
      weekly_digest: boolean
    }
  }
}
