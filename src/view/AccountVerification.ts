interface AccountVerificationProps {
  username: string;
  email: string;
  otp: string;
  frontendUrl: string;
}

const AccountVerification = ({
  username,
  email,
  otp,
  frontendUrl,
}: AccountVerificationProps) => {
  return `
 <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Taskhive</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');
        body {
            font-family: 'Poppins', Arial, sans-serif;
            line-height: 1.6;
            color: #4D4D4D;
            background-color: #FFF8E1;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background-color: #ffffff;
            color: #ffffff;
            padding-left: 20px;
            padding-right: 20px;
            padding-top: 20px;
            text-align: center;
        }
        .content {
            padding-left: 20px;
            padding-right: 20px;
            padding-bottom: 20px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #FFA000;
            color: black !important;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            text-align: center;
            cursor: pointer;
        }
        .feature {
            margin-bottom: 20px;
            background-color: #FFF8E1;
            border-radius: 10px;
            padding: 15px;
        }
        .feature img {
            max-width: 100%;
            height: auto;
        }
        .otp-box {
            background-color: #FFF8E1;
            border: 2px dashed #FFA000;
            border-radius: 10px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
        }
        .footer {
            background-color: #4D4D4D;
            color: #ffffff;
            padding: 20px;
            text-align: center;
            font-size: 14px;
        }
        .logo-container {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: white;
        }
        .logo {
            width: 70px;
            height: auto;
            margin-right: 10px;
        }
    </style>
</head>
<body>
    <table class="container" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td>
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td class="header" align="center">
                            <table cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td>
                                        <img src="https://firebasestorage.googleapis.com/v0/b/ikart-40b39.appspot.com/o/taskhive%2Flogos%2Flogo-mbl.jpg?alt=media&token=daeb011c-28ac-493e-9c6d-0520ed3ea827" alt="TaskHive Logo" class="logo">
                                    </td>
                                    <td class="logo-text"<h1 style="margin: 0; font-size: 24px;color: #FFA000;">TaskHive</h1></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td class="content">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td>
                            <h2 style="color: #FFA000; margin-top: 0;">Congratulations, ${username}!</h2>
                            <p>We're thrilled to have you join the Taskhive colony. Get ready to turn your to-do list into a hive of productivity!</p>
                            
                            <div class="otp-box">
                                <h3 style="margin: 0; color: #FFA000;">Your Honey Code</h3>
                                <p style="font-size: 32px; font-weight: bold; margin: 10px 0; color: #FFA000;">${otp}</p>
                                <p style="margin: 0;">This code is sweeter than honey and valid for 20 minutes. Don't share it with other hives!</p>
                            </div>
                            
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="${frontendUrl}" class="button">Buzz Into Your Account</a>
                                    </td>
                                </tr>
                            </table>
                            
                            <h3 style="color: #FFA000;">Why You'll Love Taskhive:</h3>
                            
                            <table class="feature" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td width="30%">
                                        <img src="https://example.com/honeycomb-interface.jpg" alt="Honeycomb Interface" style="max-width: 100%; height: auto;">
                                    </td>
                                    <td width="70%" style="padding-left: 20px;">
                                        <h4 style="margin: 0; color: #FFA000;">Honeycomb Interface</h4>
                                        <p>Our hexagon-inspired design makes task organization as natural as building a hive.</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <table class="feature" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td width="70%" style="padding-right: 20px;">
                                        <h4 style="margin: 0; color: #FFA000;">Queen Bee Prioritization</h4>
                                        <p>Let our AI 'queen bee' help you prioritize tasks based on importance and deadlines.</p>
                                    </td>
                                    <td width="30%">
                                        <img src="https://example.com/queen-bee-ai.jpg" alt="Queen Bee AI" style="max-width: 100%; height: auto;">
                                    </td>
                                </tr>
                            </table>
                            
                            <table class="feature" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td width="30%">
                                        <img src="https://example.com/hive-collaboration.jpg" alt="Hive Collaboration" style="max-width: 100%; height: auto;">
                                    </td>
                                    <td width="70%" style="padding-left: 20px;">
                                        <h4 style="margin: 0; color: #FFA000;">Hive Collaboration</h4>
                                        <p>Work together like a well-organized colony, sharing tasks and progress effortlessly.</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <h3 style="color: #FFA000; margin-top: 30px;">Start Building Your Productive Hive:</h3>
                            <ol>
                                <li>Verify your account using the button above or your Honey Code.</li>
                                <li>Set up your worker bee profile and preferences.</li>
                                <li>Create your first honeycomb project and add some nectar (tasks).</li>
                                <li>Invite other bees to your hive (optional).</li>
                                <li>Download our mobile app to keep your hive buzzing on the go!</li>
                            </ol>
                            
                            <p style="margin-top: 30px;">We're excited to see your productivity soar! If you need any help, our worker bee support team is always ready to assist.</p>
                            
                            <p>Happy task-managing!<br>The Taskhive Team</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td class="footer">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td>
                            <p style="margin: 0;">© 2024 Taskhive. All rights reserved.</p>
                            <p style="margin: 10px 0 0 0;">123 Honeycomb Lane, Beehive City, HC 98765</p>
                            <p style="margin: 10px 0 0 0;">
                                <a style="color: #ffffff;" href="https://taskhive.com/unsubscribe">Unsubscribe</a> | 
                                <a style="color: #ffffff;" href="https://taskhive.com/privacy">Privacy Policy</a>
                            </p>
                            <p style="margin: 20px 0 0 0; font-size: 12px; color: #FFE082;">
                                This email was sent to <a style="color: #eab308;" href="mailto:${email}">${email}</a>. If you'd rather
                                not receive this kind of email, you can <a style="color: #ffffff;" href="https://taskhive.com/unsubscribe">unsubscribe</a> or <a style="color: #ffffff;" href="https://taskhive.com/email-preferences">manage your email
                                preferences</a>.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    </body>
    </html>
    `;
};

export default AccountVerification;
