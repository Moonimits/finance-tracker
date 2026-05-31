export type SignInCredentials = {
  email: string
  password: string
}

export type SignUpCredentials = SignInCredentials & {
  username: string
}

export type User = {
  id: string
  email: string
  username: string
  profile_img?: string
}
