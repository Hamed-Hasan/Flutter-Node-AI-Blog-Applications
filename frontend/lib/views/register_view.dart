import 'package:flutter/material.dart';
import 'login_view.dart';

class register_view extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: BackButton(),
        title: Text('Register Account'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            // Name TextFormField
            TextFormField(
              decoration: InputDecoration(
                labelText: 'Name',
                hintText: 'Enter your name',
              ),
            ),
            SizedBox(height: 20),

            // Email TextFormField
            TextFormField(
              keyboardType: TextInputType.emailAddress,
              decoration: InputDecoration(
                labelText: 'Email',
                hintText: 'example@example.com',
              ),
            ),
            SizedBox(height: 20),

            // Password TextFormField
            TextFormField(
              obscureText: true,
              decoration: InputDecoration(
                labelText: 'Password',
                hintText: 'Enter password',
                suffixIcon: IconButton(
                  icon: Icon(Icons.visibility),
                  onPressed: () {
                    // TODO: Implement password visibility toggle
                  },
                ),
              ),
            ),
            SizedBox(height: 20),

            // Register Button
            ElevatedButton(
              child: Text('Register'),
              onPressed: () {
                // TODO: Implement registration logic
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.purple, // Background color
                 foregroundColor: Colors.white,
              ),
            ),
            TextButton(
              child: Text('Already have an account? Log in'),
              onPressed: () {
                // Navigate to the LoginView
                Navigator.of(context).pushReplacement(
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
