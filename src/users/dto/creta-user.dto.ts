export class createUserDto {
  readonly role: string;
  readonly email: string;
  readonly dateCreated: string;
  readonly password?: string;
  readonly username?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly verificationCode?: string;
  readonly age?: string;
  readonly avatarURL?: string;
  readonly status?: string;
  // readonly verificationToken?: string;
  // readonly sessionToken?: string;
  // readonly accessToken?: string;
}

export class createUserCustomerDto extends createUserDto {
  readonly password: string;
  readonly username: string;
  readonly customer?: string;
}

// export class createUserCustomerDto extends createUserDto {
//     readonly password: string;
//     readonly username: string;
//     readonly age: string;
// }
