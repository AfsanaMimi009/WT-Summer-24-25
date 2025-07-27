<!DOCTYPE html>
<html>
<head>
    <title>Bank Management System</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <center>
        <h1 style="color:blue;">Bank Management System</h1>
        <h3 style="color:blue;">Your Trusted Financial Partner</h3>
    </center>

    <div class="form-box">
        <h3>Customer Registration Form</h3>
        <form>
            <table>
                <tr>
                    <td>Enter Your Name:</td>
                    <td><input type="text"></td>
                </tr>
                <tr>
                    <td>Date of Birth:</td>
                    <td><input type="date"></td>
                </tr>
                <tr>
                    <td>Gender:</td>
                    <td><input type="radio" name="gender"> Male</td>
                    <td><input type="radio" name="gender"> Female</td>
                    <td><input type="radio" name="gender"> Other</td>
                </tr>
                <tr>
                    <td>Marital Status:</td>
                    <td>
                        <select name="Marital Status">
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Account Type:</td>
                    <td>
                        <select name="Account Type">
                            <option value="Savings">Savings</option>
                            <option value="Current">Current</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Initial Deposit Amount:</td>
                    <td><input type="text"></td>
                </tr>
                <tr>
                    <td>Mobile Number:</td>
                    <td><input type="text"></td>
                </tr>
                <tr>
                    <td>Email Address:</td>
                    <td><input type="text"></td>
                </tr>
                <tr>
                    <td>Address:</td>
                    <td><input type="text"></td>
                </tr>
                <tr>
                    <td>Occupation:</td>  
                    <td><input type="text"></td>
                </tr>
                <tr>
                    <td>NID:</td>
                    <td><input type="text"></td>
                </tr>
                <tr>
                    <td>Set Password:</td>
                    <td><input type="password"></td>
                </tr>
                <tr>
                    <td>Upload ID Proof:</td>
                    <td><input type="file"></td>
                </tr>
                <tr>
                    <td colspan="2">
                        <input type="checkbox" name="terms"> I agree to the terms and conditions
                    </td>
                </tr>
                <tr>
                    <td colspan="2" align="center">
                        <input type="submit" value="Register" class="btn">
                        <input type="reset" value="Reset" class="btn">
                    </td>
                </tr>
                
                
            </table>
        </form>

    </div>
   
        <div class="overflow-box">
            This is demo text for overflow with auto style has hkash  mkagsu anice sh dhwj</br>
        </div>
</body>
</html>