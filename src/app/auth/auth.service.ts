import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

import * as bcryptjs from 'bcryptjs';
// import { v4 } from 'uuid';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
// import { ResetPasswordDto } from './dto/reset-password.dto';
import { DelateUserDto } from './dto/id-delate.dto';
import * as nodemailer from 'nodemailer';
// import { VerificationDto } from './dto/auth-verification.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // mailer
  mailTransport() {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.MAIL_TRANSPORT_USER,
        pass: process.env.MAIL_TRANSPORT_PASS,
      },
    });
    return transporter;
  }

  async register({ name, lastname, email, password }: RegisterDto) {
    const user = await this.usersService.findOneByEmail(email);

    if (user) {
      throw new BadRequestException('Email already exists');
    }

    const registration = await this.usersService.create({
      name,
      lastname,
      email,
      password: await bcryptjs.hash(password, 12),
    });

    console.log(registration);

    return {
      name,
      email,
    };
  }

  // Ingreso
  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(email);
    const user2 = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email or Password is wrong');
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email or Password is wrong ');
    }

    const payload = {
      email: user.email,
      role: user.role,
      name: user.name,
      lastname: user.lastname,
    };

    const token = await this.jwtService.signAsync(payload);
    console.log(user2);

    //   const auth2 = v4().replace(/\D/g, '').slice(0, 5);
    //   user2.authenticationToken = auth2;
    //   this.usersService.create(user2);
    //   console.log(user2.authenticationToken);

    //   const transport = this.mailTransport();
    //   const htmlContent2 = `
    //   <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    //   <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    //   <head>
    //   <!--[if gte mso 9]>
    //   <xml>
    //     <o:OfficeDocumentSettings>
    //       <o:AllowPNG/>
    //       <o:PixelsPerInch>96</o:PixelsPerInch>
    //     </o:OfficeDocumentSettings>
    //   </xml>
    //   <![endif]-->
    //     <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //     <meta name="x-apple-disable-message-reformatting">
    //     <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
    //     <title></title>

    //       <style type="text/css">
    //         @media only screen and (min-width: 570px) {
    //     .u-row {
    //       width: 550px !important;
    //     }
    //     .u-row .u-col {
    //       vertical-align: top;
    //     }

    //     .u-row .u-col-50 {
    //       width: 275px !important;
    //     }

    //     .u-row .u-col-100 {
    //       width: 550px !important;
    //     }

    //   }

    //   @media (max-width: 570px) {
    //     .u-row-container {
    //       max-width: 100% !important;
    //       padding-left: 0px !important;
    //       padding-right: 0px !important;
    //     }
    //     .u-row .u-col {
    //       min-width: 320px !important;
    //       max-width: 100% !important;
    //       display: block !important;
    //     }
    //     .u-row {
    //       width: 100% !important;
    //     }
    //     .u-col {
    //       width: 100% !important;
    //     }
    //     .u-col > div {
    //       margin: 0 auto;
    //     }
    //   }
    //   body {
    //     margin: 0;
    //     padding: 0;
    //   }

    //   table,
    //   tr,
    //   td {
    //     vertical-align: top;
    //     border-collapse: collapse;
    //   }

    //   p {
    //     margin: 0;
    //   }

    //   .ie-container table,
    //   .mso-container table {
    //     table-layout: fixed;
    //   }

    //   * {
    //     line-height: inherit;
    //   }

    //   a[x-apple-data-detectors='true'] {
    //     color: inherit !important;
    //     text-decoration: none !important;
    //   }

    //   @media (max-width: 480px) {
    //     .hide-mobile {
    //       max-height: 0px;
    //       overflow: hidden;
    //       display: none !important;
    //     }
    //   }

    //   table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; } @media (max-width: 480px) { #u_content_image_4 .v-src-width { width: auto !important; } #u_content_image_4 .v-src-max-width { max-width: 80% !important; } }
    //       </style>

    //   <!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet" type="text/css"><!--<![endif]-->

    //   </head>

    //   <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000">
    //     <!--[if IE]><div class="ie-container"><![endif]-->
    //     <!--[if mso]><div class="mso-container"><![endif]-->
    //     <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%" cellpadding="0" cellspacing="0">
    //     <tbody>
    //     <tr style="vertical-align: top">
    //       <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
    //       <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ffffff;"><![endif]-->

    //       <!--[if gte mso 9]>
    //         <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;min-width: 320px;max-width: 550px;">
    //           <tr>
    //             <td background="https://assets.unlayer.com/projects/231830/1715195027264-808121.jpg" valign="top" width="100%">
    //         <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width: 550px;">
    //           <v:fill type="frame" src="https://assets.unlayer.com/projects/231830/1715195027264-808121.jpg" /><v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
    //         <![endif]-->

    //   <div class="u-row-container" style="padding: 0px;background-color: transparent">
    //     <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 550px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    //       <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-image: url('https://assets.unlayer.com/projects/231830/1715195027264-808121.jpg');background-repeat: no-repeat;background-position: center top;background-color: transparent;">
    //         <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-image: url('https://assets.unlayer.com/projects/231830/1715195027264-808121.jpg');background-repeat: no-repeat;background-position: center top;background-color: transparent;"><![endif]-->

    //   <!--[if (mso)|(IE)]><td align="center" width="550" style="background-color: #194f6b;width: 550px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
    //   <div class="u-col u-col-100" style="max-width: 320px;min-width: 550px;display: table-cell;vertical-align: top;">
    //     <div style="background-color: #194f6b;height: 100%;width: 100% !important;">
    //     <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->

    //   <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
    //     <tbody>
    //       <tr>
    //         <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

    //   <table width="100%" cellpadding="0" cellspacing="0" border="0">
    //     <tr>
    //       <td style="padding-right: 0px;padding-left: 0px;" align="center">

    //         <img align="center" border="0" src="https://assets.unlayer.com/projects/231830/1715192727890-Imagen%201.png" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 84%;max-width: 445.2px;" width="445.2" class="v-src-width v-src-max-width"/>

    //       </td>
    //     </tr>
    //   </table>

    //         </td>
    //       </tr>
    //     </tbody>
    //   </table>

    //     <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
    //     </div>
    //   </div>
    //   <!--[if (mso)|(IE)]></td><![endif]-->
    //         <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    //       </div>
    //     </div>
    //     </div>

    //       <!--[if gte mso 9]>
    //         </v:textbox></v:rect>
    //       </td>
    //       </tr>
    //       </table>
    //       <![endif]-->

    //       <!--[if gte mso 9]>
    //         <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;min-width: 320px;max-width: 550px;">
    //           <tr>
    //             <td background="https://assets.unlayer.com/projects/231830/1715193708778-Imagen%201.jpg" valign="top" width="100%">
    //         <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width: 550px;">
    //           <v:fill type="frame" src="https://assets.unlayer.com/projects/231830/1715193708778-Imagen%201.jpg" /><v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
    //         <![endif]-->

    //   <div class="u-row-container" style="padding: 0px;background-color: transparent">
    //     <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 550px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    //       <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-image: url('https://assets.unlayer.com/projects/231830/1715193708778-Imagen%201.jpg');background-repeat: no-repeat;background-position: center bottom;background-color: transparent;">
    //         <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-image: url('https://assets.unlayer.com/projects/231830/1715193708778-Imagen%201.jpg');background-repeat: no-repeat;background-position: center bottom;background-color: transparent;"><![endif]-->

    //   <!--[if (mso)|(IE)]><td align="center" width="275" style="width: 275px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
    //   <div class="u-col u-col-50" style="max-width: 320px;min-width: 275px;display: table-cell;vertical-align: top;">
    //     <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
    //     <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

    //   <table id="u_content_image_4" class="hide-mobile" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
    //     <tbody>
    //       <tr>
    //         <td style="overflow-wrap:break-word;word-break:break-word;padding:50px 10px 25px;font-family:arial,helvetica,sans-serif;" align="left">

    //   <table width="100%" cellpadding="0" cellspacing="0" border="0">
    //     <tr>
    //       <td style="padding-right: 0px;padding-left: 0px;" align="center">

    //         <img align="center" border="0" src="https://assets.unlayer.com/projects/231830/1715192866670-Imagen%201.png" alt="Hero Image" title="Hero Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 84%;max-width: 214.2px;" width="214.2" class="v-src-width v-src-max-width"/>

    //       </td>
    //     </tr>
    //   </table>

    //         </td>
    //       </tr>
    //     </tbody>
    //   </table>

    //     <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
    //     </div>
    //   </div>
    //   <!--[if (mso)|(IE)]></td><![endif]-->
    //   <!--[if (mso)|(IE)]><td align="center" width="275" style="width: 275px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
    //   <div class="u-col u-col-50" style="max-width: 320px;min-width: 275px;display: table-cell;vertical-align: top;">
    //     <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
    //     <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

    //   <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
    //     <tbody>
    //       <tr>
    //         <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 20px 5px;font-family:arial,helvetica,sans-serif;" align="left">

    //     <!--[if mso]><table width="100%"><tr><td><![endif]-->
    //       <h2 style="margin: 0px; color: #02a9ff; line-height: 140%; text-align: center; word-wrap: break-word; font-family: 'Open Sans',sans-serif; font-size: 28px; font-weight: 400;"><span><span><span><span><span><span><span><span><span><span><span><span><span>Verification Code</span></span></span></span></span></span></span></span></span></span></span></span></span></h2>
    //     <!--[if mso]></td></tr></table><![endif]-->

    //         </td>
    //       </tr>
    //     </tbody>
    //   </table>

    //   <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
    //     <tbody>
    //       <tr>
    //         <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 20px 5px;font-family:arial,helvetica,sans-serif;" align="left">

    //     <!--[if mso]><table width="100%"><tr><td><![endif]-->
    //       <h1 style="margin: 0px; color: #141414; line-height: 90%; text-align: center; word-wrap: break-word; font-family: 'Open Sans',sans-serif; font-size: 22px; font-weight: 400;"><span><span><span><span><span style="line-height: 19.8px;"><span style="line-height: 19.8px;"><span style="line-height: 19.8px;">Hey ${user.name}</span></span></span></span></span></span></span></h1>
    //     <!--[if mso]></td></tr></table><![endif]-->

    //         </td>
    //       </tr>
    //     </tbody>
    //   </table>

    //   <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
    //     <tbody>
    //       <tr>
    //         <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 10px;font-family:arial,helvetica,sans-serif;" align="left">

    //     <div style="font-size: 14px; color: #443e3e; line-height: 200%; text-align: center; word-wrap: break-word;">
    //       <p style="font-size: 14px; line-height: 200%;">Thank you for choosing Mobile Enterprise Resources, LLC. Use the following OTP to complete the procedure to log into your account.<br />Remember, never share this code with others, including Mobile Enterprise Resources employees.</p>
    //     </div>

    //         </td>
    //       </tr>
    //     </tbody>
    //   </table>

    //     <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
    //     </div>
    //   </div>
    //   <!--[if (mso)|(IE)]></td><![endif]-->
    //         <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    //       </div>
    //     </div>
    //     </div>

    //       <!--[if gte mso 9]>
    //         </v:textbox></v:rect>
    //       </td>
    //       </tr>
    //       </table>
    //       <![endif]-->

    //       <!--[if gte mso 9]>
    //         <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;min-width: 320px;max-width: 550px;">
    //           <tr>
    //             <td background="https://assets.unlayer.com/projects/231830/1715194208735-Imagen%201.jpg" valign="top" width="100%">
    //         <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width: 550px;">
    //           <v:fill type="frame" src="https://assets.unlayer.com/projects/231830/1715194208735-Imagen%201.jpg" /><v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
    //         <![endif]-->

    //   <div class="u-row-container" style="padding: 0px;background-color: transparent">
    //     <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 550px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    //       <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-image: url('https://assets.unlayer.com/projects/231830/1715194208735-Imagen%201.jpg');background-repeat: no-repeat;background-position: center top;background-color: transparent;">
    //         <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-image: url('https://assets.unlayer.com/projects/231830/1715194208735-Imagen%201.jpg');background-repeat: no-repeat;background-position: center top;background-color: transparent;"><![endif]-->

    //   <!--[if (mso)|(IE)]><td align="center" width="550" style="width: 550px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
    //   <div class="u-col u-col-100" style="max-width: 320px;min-width: 550px;display: table-cell;vertical-align: top;">
    //     <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
    //     <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

    //   <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
    //     <tbody>
    //       <tr>
    //         <td style="overflow-wrap:break-word;word-break:break-word;padding:15px 10px 12px;font-family:arial,helvetica,sans-serif;" align="left">

    //     <!--[if mso]><table width="100%"><tr><td><![endif]-->
    //       <h1 style="margin: 0px; color: #3b4d63; line-height: 120%; text-align: center; word-wrap: break-word; font-family: arial,helvetica,sans-serif; font-size: 41px; font-weight: 400;"><span><span><strong>${auth2}</strong></span></span></h1>
    //     <!--[if mso]></td></tr></table><![endif]-->

    //         </td>
    //       </tr>
    //     </tbody>
    //   </table>

    //   <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
    //     <tbody>
    //       <tr>
    //         <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

    //     <!--[if mso]><table width="100%"><tr><td><![endif]-->
    //       <h1 style="margin: 0px; line-height: 140%; text-align: center; word-wrap: break-word; font-size: 22px; font-weight: 400;"><span><span><span><span style="color: #3598db; line-height: 26.6px;"><strong><span style="line-height: 26.6px;">Valid For 15 minutes Only!<br />Team Mer App 📦</span></strong></span></span></span></span></h1>
    //     <!--[if mso]></td></tr></table><![endif]-->

    //         </td>
    //       </tr>
    //     </tbody>
    //   </table>

    //     <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
    //     </div>
    //   </div>
    //   <!--[if (mso)|(IE)]></td><![endif]-->
    //         <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    //       </div>
    //     </div>
    //     </div>

    //       <!--[if gte mso 9]>
    //         </v:textbox></v:rect>
    //       </td>
    //       </tr>
    //       </table>
    //       <![endif]-->

    //   <div class="u-row-container" style="padding: 0px;background-color: transparent">
    //     <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 550px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #194f6b;">
    //       <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
    //         <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-color: #194f6b;"><![endif]-->

    //   <!--[if (mso)|(IE)]><td align="center" width="550" style="width: 550px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
    //   <div class="u-col u-col-100" style="max-width: 320px;min-width: 550px;display: table-cell;vertical-align: top;">
    //     <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
    //     <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

    //   <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
    //     <tbody>
    //       <tr>
    //         <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

    //     <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="83%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #02a9ff;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
    //       <tbody>
    //         <tr style="vertical-align: top">
    //           <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
    //             <span>&#160;</span>
    //           </td>
    //         </tr>
    //       </tbody>
    //     </table>

    //         </td>
    //       </tr>
    //     </tbody>
    //   </table>

    //   <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
    //     <tbody>
    //       <tr>
    //         <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

    //     <div style="font-size: 14px; color: #ffffff; line-height: 330%; text-align: center; word-wrap: break-word;">
    //       <p style="font-size: 14px; line-height: 330%;">Need help? Ask at <span style="color: #3598db; line-height: 46.2px;"><a href="mailto:archisketch@gmail.com" style="color: #3598db;">mer.app.dev@gmail.com</a></span> or visit our</p>
    //   <p style="font-size: 14px; line-height: 330%;">Copyright © 2024 Company. All rights reserved.</p>
    //     </div>

    //         </td>
    //       </tr>
    //     </tbody>
    //   </table>

    //     <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
    //     </div>
    //   </div>
    //   <!--[if (mso)|(IE)]></td><![endif]-->
    //         <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    //       </div>
    //     </div>
    //     </div>

    //       <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    //       </td>
    //     </tr>
    //     </tbody>
    //     </table>
    //     <!--[if mso]></div><![endif]-->
    //     <!--[if IE]></div><![endif]-->
    //   </body>

    //   </html>

    // `;

    //   const info = await transport.sendMail({
    //     from: '"MER APP 📦" <dominicode.mer.app.dev@gmail.com>', // sender address
    //     to: email, // list of receivers
    //     subject: 'Verification Code 🔒', // Subject line
    //     text: 'Verification Code', // plain text body
    //     html: htmlContent2, // html body
    //   });

    return {
      token: token,
      email: user.email,
    };
  }

  // Ingreso
  async loginAuthentication({ email, password }: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('Email or Password is wrong');
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email or Password is wrong');
    }

    const payload = {
      email: user.email,
      role: user.role,
      name: user.name,
      lastname: user.lastname,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token: token,
      email: user.email,
    };
  }

  // // Resend
  // async resendCode({ email }: RequestResetPasswordDto) {
  //   const user = await this.usersService.findOneByEmail(email);
  //   if (!user) {
  //     throw new UnauthorizedException('Email or Password is wrong');
  //   }

  //   const auth2 = v4().replace(/\D/g, '').slice(0, 5);
  //   user.authenticationToken = auth2;
  //   this.usersService.create(user);
  //   console.log(user.authenticationToken);

  //   const transport = this.mailTransport();
  //   const htmlContent2 = `
  //     <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  //     <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  //     <head>
  //     <!--[if gte mso 9]>
  //     <xml>
  //       <o:OfficeDocumentSettings>
  //         <o:AllowPNG/>
  //         <o:PixelsPerInch>96</o:PixelsPerInch>
  //       </o:OfficeDocumentSettings>
  //     </xml>
  //     <![endif]-->
  //       <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //       <meta name="x-apple-disable-message-reformatting">
  //       <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
  //       <title></title>

  //         <style type="text/css">
  //           @media only screen and (min-width: 570px) {
  //       .u-row {
  //         width: 550px !important;
  //       }
  //       .u-row .u-col {
  //         vertical-align: top;
  //       }

  //       .u-row .u-col-50 {
  //         width: 275px !important;
  //       }

  //       .u-row .u-col-100 {
  //         width: 550px !important;
  //       }

  //     }

  //     @media (max-width: 570px) {
  //       .u-row-container {
  //         max-width: 100% !important;
  //         padding-left: 0px !important;
  //         padding-right: 0px !important;
  //       }
  //       .u-row .u-col {
  //         min-width: 320px !important;
  //         max-width: 100% !important;
  //         display: block !important;
  //       }
  //       .u-row {
  //         width: 100% !important;
  //       }
  //       .u-col {
  //         width: 100% !important;
  //       }
  //       .u-col > div {
  //         margin: 0 auto;
  //       }
  //     }
  //     body {
  //       margin: 0;
  //       padding: 0;
  //     }

  //     table,
  //     tr,
  //     td {
  //       vertical-align: top;
  //       border-collapse: collapse;
  //     }

  //     p {
  //       margin: 0;
  //     }

  //     .ie-container table,
  //     .mso-container table {
  //       table-layout: fixed;
  //     }

  //     * {
  //       line-height: inherit;
  //     }

  //     a[x-apple-data-detectors='true'] {
  //       color: inherit !important;
  //       text-decoration: none !important;
  //     }

  //     @media (max-width: 480px) {
  //       .hide-mobile {
  //         max-height: 0px;
  //         overflow: hidden;
  //         display: none !important;
  //       }
  //     }

  //     table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; } @media (max-width: 480px) { #u_content_image_4 .v-src-width { width: auto !important; } #u_content_image_4 .v-src-max-width { max-width: 80% !important; } }
  //         </style>

  //     <!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet" type="text/css"><!--<![endif]-->

  //     </head>

  //     <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000">
  //       <!--[if IE]><div class="ie-container"><![endif]-->
  //       <!--[if mso]><div class="mso-container"><![endif]-->
  //       <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%" cellpadding="0" cellspacing="0">
  //       <tbody>
  //       <tr style="vertical-align: top">
  //         <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
  //         <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ffffff;"><![endif]-->

  //         <!--[if gte mso 9]>
  //           <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;min-width: 320px;max-width: 550px;">
  //             <tr>
  //               <td background="https://assets.unlayer.com/projects/231830/1715195027264-808121.jpg" valign="top" width="100%">
  //           <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width: 550px;">
  //             <v:fill type="frame" src="https://assets.unlayer.com/projects/231830/1715195027264-808121.jpg" /><v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
  //           <![endif]-->

  //     <div class="u-row-container" style="padding: 0px;background-color: transparent">
  //       <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 550px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
  //         <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-image: url('https://assets.unlayer.com/projects/231830/1715195027264-808121.jpg');background-repeat: no-repeat;background-position: center top;background-color: transparent;">
  //           <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-image: url('https://assets.unlayer.com/projects/231830/1715195027264-808121.jpg');background-repeat: no-repeat;background-position: center top;background-color: transparent;"><![endif]-->

  //     <!--[if (mso)|(IE)]><td align="center" width="550" style="background-color: #194f6b;width: 550px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
  //     <div class="u-col u-col-100" style="max-width: 320px;min-width: 550px;display: table-cell;vertical-align: top;">
  //       <div style="background-color: #194f6b;height: 100%;width: 100% !important;">
  //       <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->

  //     <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  //       <tbody>
  //         <tr>
  //           <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

  //     <table width="100%" cellpadding="0" cellspacing="0" border="0">
  //       <tr>
  //         <td style="padding-right: 0px;padding-left: 0px;" align="center">

  //           <img align="center" border="0" src="https://assets.unlayer.com/projects/231830/1715192727890-Imagen%201.png" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 84%;max-width: 445.2px;" width="445.2" class="v-src-width v-src-max-width"/>

  //         </td>
  //       </tr>
  //     </table>

  //           </td>
  //         </tr>
  //       </tbody>
  //     </table>

  //       <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  //       </div>
  //     </div>
  //     <!--[if (mso)|(IE)]></td><![endif]-->
  //           <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
  //         </div>
  //       </div>
  //       </div>

  //         <!--[if gte mso 9]>
  //           </v:textbox></v:rect>
  //         </td>
  //         </tr>
  //         </table>
  //         <![endif]-->

  //         <!--[if gte mso 9]>
  //           <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;min-width: 320px;max-width: 550px;">
  //             <tr>
  //               <td background="https://assets.unlayer.com/projects/231830/1715193708778-Imagen%201.jpg" valign="top" width="100%">
  //           <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width: 550px;">
  //             <v:fill type="frame" src="https://assets.unlayer.com/projects/231830/1715193708778-Imagen%201.jpg" /><v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
  //           <![endif]-->

  //     <div class="u-row-container" style="padding: 0px;background-color: transparent">
  //       <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 550px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
  //         <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-image: url('https://assets.unlayer.com/projects/231830/1715193708778-Imagen%201.jpg');background-repeat: no-repeat;background-position: center bottom;background-color: transparent;">
  //           <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-image: url('https://assets.unlayer.com/projects/231830/1715193708778-Imagen%201.jpg');background-repeat: no-repeat;background-position: center bottom;background-color: transparent;"><![endif]-->

  //     <!--[if (mso)|(IE)]><td align="center" width="275" style="width: 275px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
  //     <div class="u-col u-col-50" style="max-width: 320px;min-width: 275px;display: table-cell;vertical-align: top;">
  //       <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
  //       <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

  //     <table id="u_content_image_4" class="hide-mobile" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  //       <tbody>
  //         <tr>
  //           <td style="overflow-wrap:break-word;word-break:break-word;padding:50px 10px 25px;font-family:arial,helvetica,sans-serif;" align="left">

  //     <table width="100%" cellpadding="0" cellspacing="0" border="0">
  //       <tr>
  //         <td style="padding-right: 0px;padding-left: 0px;" align="center">

  //           <img align="center" border="0" src="https://assets.unlayer.com/projects/231830/1715192866670-Imagen%201.png" alt="Hero Image" title="Hero Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 84%;max-width: 214.2px;" width="214.2" class="v-src-width v-src-max-width"/>

  //         </td>
  //       </tr>
  //     </table>

  //           </td>
  //         </tr>
  //       </tbody>
  //     </table>

  //       <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  //       </div>
  //     </div>
  //     <!--[if (mso)|(IE)]></td><![endif]-->
  //     <!--[if (mso)|(IE)]><td align="center" width="275" style="width: 275px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
  //     <div class="u-col u-col-50" style="max-width: 320px;min-width: 275px;display: table-cell;vertical-align: top;">
  //       <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
  //       <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

  //     <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  //       <tbody>
  //         <tr>
  //           <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 20px 5px;font-family:arial,helvetica,sans-serif;" align="left">

  //       <!--[if mso]><table width="100%"><tr><td><![endif]-->
  //         <h2 style="margin: 0px; color: #02a9ff; line-height: 140%; text-align: center; word-wrap: break-word; font-family: 'Open Sans',sans-serif; font-size: 28px; font-weight: 400;"><span><span><span><span><span><span><span><span><span><span><span><span><span>Verification Code</span></span></span></span></span></span></span></span></span></span></span></span></span></h2>
  //       <!--[if mso]></td></tr></table><![endif]-->

  //           </td>
  //         </tr>
  //       </tbody>
  //     </table>

  //     <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  //       <tbody>
  //         <tr>
  //           <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 20px 5px;font-family:arial,helvetica,sans-serif;" align="left">

  //       <!--[if mso]><table width="100%"><tr><td><![endif]-->
  //         <h1 style="margin: 0px; color: #141414; line-height: 90%; text-align: center; word-wrap: break-word; font-family: 'Open Sans',sans-serif; font-size: 22px; font-weight: 400;"><span><span><span><span><span style="line-height: 19.8px;"><span style="line-height: 19.8px;"><span style="line-height: 19.8px;">Hey ${user.name}</span></span></span></span></span></span></span></h1>
  //       <!--[if mso]></td></tr></table><![endif]-->

  //           </td>
  //         </tr>
  //       </tbody>
  //     </table>

  //     <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  //       <tbody>
  //         <tr>
  //           <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 10px;font-family:arial,helvetica,sans-serif;" align="left">

  //       <div style="font-size: 14px; color: #443e3e; line-height: 200%; text-align: center; word-wrap: break-word;">
  //         <p style="font-size: 14px; line-height: 200%;">Thank you for choosing Mobile Enterprise Resources, LLC. Use the following OTP to complete the procedure to log into your account.<br />Remember, never share this code with others, including Mobile Enterprise Resources employees.</p>
  //       </div>

  //           </td>
  //         </tr>
  //       </tbody>
  //     </table>

  //       <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  //       </div>
  //     </div>
  //     <!--[if (mso)|(IE)]></td><![endif]-->
  //           <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
  //         </div>
  //       </div>
  //       </div>

  //         <!--[if gte mso 9]>
  //           </v:textbox></v:rect>
  //         </td>
  //         </tr>
  //         </table>
  //         <![endif]-->

  //         <!--[if gte mso 9]>
  //           <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;min-width: 320px;max-width: 550px;">
  //             <tr>
  //               <td background="https://assets.unlayer.com/projects/231830/1715194208735-Imagen%201.jpg" valign="top" width="100%">
  //           <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width: 550px;">
  //             <v:fill type="frame" src="https://assets.unlayer.com/projects/231830/1715194208735-Imagen%201.jpg" /><v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
  //           <![endif]-->

  //     <div class="u-row-container" style="padding: 0px;background-color: transparent">
  //       <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 550px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
  //         <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-image: url('https://assets.unlayer.com/projects/231830/1715194208735-Imagen%201.jpg');background-repeat: no-repeat;background-position: center top;background-color: transparent;">
  //           <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-image: url('https://assets.unlayer.com/projects/231830/1715194208735-Imagen%201.jpg');background-repeat: no-repeat;background-position: center top;background-color: transparent;"><![endif]-->

  //     <!--[if (mso)|(IE)]><td align="center" width="550" style="width: 550px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
  //     <div class="u-col u-col-100" style="max-width: 320px;min-width: 550px;display: table-cell;vertical-align: top;">
  //       <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
  //       <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

  //     <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  //       <tbody>
  //         <tr>
  //           <td style="overflow-wrap:break-word;word-break:break-word;padding:15px 10px 12px;font-family:arial,helvetica,sans-serif;" align="left">

  //       <!--[if mso]><table width="100%"><tr><td><![endif]-->
  //         <h1 style="margin: 0px; color: #3b4d63; line-height: 120%; text-align: center; word-wrap: break-word; font-family: arial,helvetica,sans-serif; font-size: 41px; font-weight: 400;"><span><span><strong>${auth2}</strong></span></span></h1>
  //       <!--[if mso]></td></tr></table><![endif]-->

  //           </td>
  //         </tr>
  //       </tbody>
  //     </table>

  //     <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  //       <tbody>
  //         <tr>
  //           <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

  //       <!--[if mso]><table width="100%"><tr><td><![endif]-->
  //         <h1 style="margin: 0px; line-height: 140%; text-align: center; word-wrap: break-word; font-size: 22px; font-weight: 400;"><span><span><span><span style="color: #3598db; line-height: 26.6px;"><strong><span style="line-height: 26.6px;">Valid For 15 minutes Only!<br />Team Mer App 📦</span></strong></span></span></span></span></h1>
  //       <!--[if mso]></td></tr></table><![endif]-->

  //           </td>
  //         </tr>
  //       </tbody>
  //     </table>

  //       <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  //       </div>
  //     </div>
  //     <!--[if (mso)|(IE)]></td><![endif]-->
  //           <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
  //         </div>
  //       </div>
  //       </div>

  //         <!--[if gte mso 9]>
  //           </v:textbox></v:rect>
  //         </td>
  //         </tr>
  //         </table>
  //         <![endif]-->

  //     <div class="u-row-container" style="padding: 0px;background-color: transparent">
  //       <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 550px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #194f6b;">
  //         <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
  //           <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-color: #194f6b;"><![endif]-->

  //     <!--[if (mso)|(IE)]><td align="center" width="550" style="width: 550px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
  //     <div class="u-col u-col-100" style="max-width: 320px;min-width: 550px;display: table-cell;vertical-align: top;">
  //       <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
  //       <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

  //     <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  //       <tbody>
  //         <tr>
  //           <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

  //       <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="83%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #02a9ff;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
  //         <tbody>
  //           <tr style="vertical-align: top">
  //             <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
  //               <span>&#160;</span>
  //             </td>
  //           </tr>
  //         </tbody>
  //       </table>

  //           </td>
  //         </tr>
  //       </tbody>
  //     </table>

  //     <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  //       <tbody>
  //         <tr>
  //           <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

  //       <div style="font-size: 14px; color: #ffffff; line-height: 330%; text-align: center; word-wrap: break-word;">
  //         <p style="font-size: 14px; line-height: 330%;">Need help? Ask at <span style="color: #3598db; line-height: 46.2px;"><a href="mailto:archisketch@gmail.com" style="color: #3598db;">mer.app.dev@gmail.com</a></span> or visit our</p>
  //     <p style="font-size: 14px; line-height: 330%;">Copyright © 2024 Company. All rights reserved.</p>
  //       </div>

  //           </td>
  //         </tr>
  //       </tbody>
  //     </table>

  //       <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  //       </div>
  //     </div>
  //     <!--[if (mso)|(IE)]></td><![endif]-->
  //           <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
  //         </div>
  //       </div>
  //       </div>

  //         <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
  //         </td>
  //       </tr>
  //       </tbody>
  //       </table>
  //       <!--[if mso]></div><![endif]-->
  //       <!--[if IE]></div><![endif]-->
  //     </body>

  //     </html>

  //   `;

  //   await transport.sendMail({
  //     from: '"MER APP 📦" <dominicode.mer.app.dev@gmail.com>', // sender address
  //     to: email, // list of receivers
  //     subject: 'Verification Code 🔒', // Subject line
  //     text: 'Verification Code', // plain text body
  //     html: htmlContent2, // html body
  //   });

  //   return {
  //     email: user.email,
  //   };
  // }

  // Todos los usuarios
  async profile({ email, role }: { email: string; role: string }) {
    console.log(email, role);
    return await this.usersService.findAll();
  }

  // actilziar rol
  // async register({ name, lastname, email, phone, password }: RegisterDto) {

  //   async updateRole(updateRoleDto: UpdateRoleDto) {

  async updateRole({ id, role }: UpdateRoleDto) {
    return await this.usersService.updateRoleUser(id!, role!);
  }

  // Recuperar cuenta
  async requestResetPassword(requestResetPasswordDto: RequestResetPasswordDto) {
    const { email } = requestResetPasswordDto;
    return `REPASS${email}`;
    //   const user = await this.usersService.findOneByEmail(email);
    //   if (!user) {
    //     throw new BadRequestException(`User with email ${email} not found`);
    //   }

    //   user.resetPasswordToken = v4();

    //   this.usersService.create(user);
    //   console.log(user.resetPasswordToken);
    //   const resetToken = user.resetPasswordToken;

    //   const urlReset = `${process.env.URL_FRONTEND}reset-password?token=${resetToken}`;

    //   const transport = this.mailTransport();
    //   const htmlContent = `
    //   <div style="margin: 0; background-color: #f2f3f8;">
    //     <table cellSpacing="0" cellPadding="0" width="100%" style="font-family: 'Open Sans', sans-serif;">
    //       <tbody>
    //         <tr>
    //           <td>
    //             <table style="background-color: #f2f3f8; max-width: 670px; margin: 0 auto;" width="100%" border="0" align="center" cellPadding="0" cellSpacing="0">
    //               <tbody>
    //                 <tr>
    //                   <td style="height: 80px;">&nbsp;</td>
    //                 </tr>
    //                 <tr>
    //                   <td style="text-align: center;">
    //                     <a href="https://www.mertechnology.com" title="logo" target="_blank">
    //                       <img width="120" src="https://images.squarespace-cdn.com/content/v1/5f38a4284c13b4408de5f6d5/c5bc5022-acc5-4932-84eb-a737c1a54270/MER+Logo.png" title="logo" alt="logo" />
    //                     </a>
    //                   </td>
    //                 </tr>
    //                 <tr>
    //                   <td style="height: 20px;">&nbsp;</td>
    //                 </tr>
    //                 <tr>
    //                   <td>
    //                     <table width="95%" border="0" align="center" cellPadding="0" cellSpacing="0" style="max-width: 670px; background: #fff; border-radius: 3px; text-align: center; -webkit-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06); -moz-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06); box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);">
    //                       <tbody>
    //                         <tr>
    //                           <td style="height: 40px;">&nbsp;</td>
    //                         </tr>
    //                         <tr>
    //                           <td style="padding: 0 35px;">
    //                             <h1 style="color: #4481eb; font-weight: 500; margin: 0; font-size: 28px; font-family: 'Rubik', sans-serif;">Mobile Enterprise Resources, LLC</h1>
    //                             <h1 style="color: #1e1e2d; font-weight: 500; margin: 0; font-size: 25px; font-family: 'Rubik', sans-serif;">You have requested to reset your password</h1>
    //                             <span style="display: inline-block; vertical-align: middle; margin: 29px 0 26px; border-bottom: 1px solid #cecece; width: 100px;"></span>
    //                             <p style="color: #455056; font-size: 15px; line-height: 24px; margin: 0;">We cannot simply send you your old password. A unique link to reset your password has been generated for you. To reset your password, click the following link and follow the instructions.</p>
    //                             <a href=${urlReset} style="background: #4481eb; text-decoration: none !important; font-weight: 500; margin-top: 35px; color: #fff; text-transform: uppercase; font-size: 14px; padding: 10px 24px; display: inline-block; border-radius: 50px;">Reset Password</a>
    //                           </td>
    //                         </tr>
    //                         <tr>
    //                           <td style="height: 40px;">&nbsp;</td>
    //                         </tr>
    //                       </tbody>
    //                     </table>
    //                   </td>
    //                 </tr>
    //                 <tr>
    //                   <td style="height: 20px;">&nbsp;</td>
    //                 </tr>
    //                 <tr>
    //                   <td style="text-align: center;">
    //                     <p style="font-size: 14px; color: rgba(69, 80, 86, 0.7411764705882353); line-height: 18px; margin: 0 0 0;">&copy; <strong>https://www.mertechnology.com</strong></p>
    //                   </td>
    //                 </tr>
    //                 <tr>
    //                   <td style="height: 80px;">&nbsp;</td>
    //                 </tr>
    //               </tbody>
    //             </table>
    //           </td>
    //         </tr>
    //       </tbody>
    //     </table>
    //   </div>
    // `;

    //   // send mail with defined transport object
    //   const info = await transport.sendMail({
    //     from: '"MER APP 📦" <dominicode.mer.app.dev@gmail.com>', // sender address
    //     to: email, // list of receivers
    //     subject: 'Password Reset 🚚', // Subject line
    //     text: 'Password Reset', // plain text body
    //     html: htmlContent, // html body
    //   });
    //   // console.log(process.env.NODEMAILER_URL);
    //   // console.log('Message sent: %s', info.messageId);
    //   return user.resetPasswordToken;
    //   // enviar link por email
  }

  // async resetPassword(resetPasswordDto: ResetPasswordDto) {
  //   const { resetPasswordToken, password } = resetPasswordDto;
  //   const user =
  //     await this.usersService.findOneByResetPasswordToken(resetPasswordToken);

  //   if (!user) {
  //     throw new UnauthorizedException('Email is wrong');
  //   }
  //   console.log(user);
  //   // password: await bcryptjs.hash(password, 12),

  //   user.password = await bcryptjs.hash(password, 12);
  //   user.resetPasswordToken = null;
  //   this.usersService.create(user);
  // }

  // Eliminar usuario

  async deleteUser({ id }: DelateUserDto) {
    const email = await this.usersService.findOneById(id);
    if (!email) {
      throw new BadRequestException('Email already exists');
    }

    return await this.usersService.delateUserById(id);
  }

  // async authVerification(verificationDto: VerificationDto) {
  //   const { verification } = verificationDto;
  //   const user =
  //     await this.usersService.findOneByVerificationCode(verification);

  //   if (!user) {
  //     throw new UnauthorizedException('Verification code not found');
  //   }
  //   user.authenticationToken = null;
  //   this.usersService.create(user);

  //   return {
  //     status: 200,
  //     message: 'Verification successful.',
  //   };
  // }
}
