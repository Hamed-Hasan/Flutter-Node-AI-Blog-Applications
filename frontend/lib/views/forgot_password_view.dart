import 'package:flutter/material.dart';
import 'login_view.dart';

class forgot_password_view extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: BackButton(),
        title: Text('Forgot Password'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            // Username TextFormField
            TextFormField(
              decoration: InputDecoration(
                labelText: 'Username',
                hintText: 'Enter your username',
              ),
            ),
            SizedBox(height: 20),
            // Password TextFormField
            TextFormField(
              obscureText: true,
              decoration: InputDecoration(
                labelText: 'Password',
                hintText: 'Enter your password',
              ),
            ),
            SizedBox(height: 20),
            // Reset Password Button
            ElevatedButton(
              child: Text('Reset Password'),
              onPressed: () {
                // TODO: Implement reset password logic
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.purple, // Background color
                foregroundColor: Colors.white, // Text color
              ),
            ),
            TextButton(
              child: Text('Back to Login'),
              onPressed: () {
                // Navigate to the LoginView
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => login_view(),
                  ),
                );
              },
            ),
            Spacer(),
            // Footer Text
            Text(
              'By using Classroom, you agree to the Terms and Privacy Policy.',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.grey,
              ),
            ),
          ],
        ),
      ),
    );
  }
}