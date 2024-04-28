import 'package:flutter/material.dart';
// import 'package:scaffold_messenger/scaffold_messenger.dart';
import '../services/api_service.dart';
import 'forgot_password_view.dart';
import 'home_view.dart';


class LoginView extends StatefulWidget {
  @override
  _LoginViewState createState() => _LoginViewState();
}

class _LoginViewState extends State<LoginView> {
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscureText = true; // Initial value for obscure text
 final UserService _userService = UserService(); // Instantiate your UserService

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

void _login() async {
  try {
    final user = await _userService.loginUser(
      _usernameController.text, 
      _passwordController.text,
    );
    // Check if the token is not null and not empty
    if (user?.token?.isNotEmpty == true) {
      // Navigate to the HomePage
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (context) => HomePage()),
        (Route<dynamic> route) => false,
      );
    } else {
      // Handle the situation where the token is null or empty
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Login failed: Invalid token'),
        ),
      );
    }
  } catch (e) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Failed to login: $e'),
      ),
    );
  }
}



  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: BackButton(),
        title: Text('Log into account'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            TextFormField(
              controller: _usernameController, // Add the controller
              keyboardType: TextInputType.emailAddress,
              decoration: InputDecoration(
                labelText: 'Email',
                hintText: 'example@example.com',
              ),
            ),
            SizedBox(height: 20),
            TextFormField(
              controller: _passwordController, // Add the controller
              obscureText: _obscureText, // Use the obscureText value
              decoration: InputDecoration(
                labelText: 'Password',
                hintText: 'Enter password',
                suffixIcon: IconButton(
                  icon: Icon(
                    _obscureText ? Icons.visibility : Icons.visibility_off,
                  ),
                  onPressed: () {
                    setState(() {
                      _obscureText = !_obscureText; // Toggle the obscureText value
                    });
                  },
                ),
              ),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              child: Text('Log in'),
              onPressed: _login, // Call the _login function on press
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.purple,
                foregroundColor: Colors.white,
              ),
            ),
            TextButton(
              child: Text('Forgot password?'),
              onPressed: () {
                // Navigate to the ForgotPasswordView
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => forgot_password_view(),
                  ),
                );
              },
            ),
            Spacer(),
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
