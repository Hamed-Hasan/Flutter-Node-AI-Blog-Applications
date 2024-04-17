import 'package:flutter/material.dart';

class login_view extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: BackButton(), // Provides a back button in the app bar
        title: Text('Log into account'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            // Email TextFormField
            TextFormField(
              keyboardType: TextInputType.emailAddress,
              decoration: InputDecoration(
                labelText: 'Email',
                hintText: 'example@example.com',
              ),
            ),
            SizedBox(height: 20), // Adds space between input fields
            // Password TextFormField
            TextFormField(
              obscureText: true, // Hides the password
              decoration: InputDecoration(
                labelText: 'Password',
                hintText: 'Enter password',
                // Adds an eye icon to toggle password visibility
                suffixIcon: IconButton(
                  icon: Icon(Icons.visibility),
                  onPressed: () {
                    // TODO: Implement password visibility toggle
                  },
                ),
              ),
            ),
            SizedBox(height: 20), // Adds space before the login button
            // Log in Button
            ElevatedButton(
              child: Text('Log in'),
              onPressed: () {
                // TODO: Implement login logic
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.purple,// Background color
              ),
            ),
            TextButton(
              child: Text('Forgot password?'),
              onPressed: () {
                // TODO: Implement forgot password logic
              },
            ),
            Spacer(), // Pushes the footer to the end of the screen
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
