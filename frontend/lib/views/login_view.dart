import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'forgot_password_view.dart';
import 'home_view.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LoginView extends StatefulWidget {
  @override
  _LoginViewState createState() => _LoginViewState();
}

class _LoginViewState extends State<LoginView> {
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscureText = true;
  final UserService _userService = UserService();

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _printToken() async {
    final prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString('auth_token');
    print('Saved token: $token');
  }

  void _login() async {
    try {
      final user = await _userService.loginUser(
        _usernameController.text,
        _passwordController.text,
      );
      if (user?.token?.isNotEmpty == true) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_token', user.token!);

        // Verbose debug output
        print('Token saved successfully');

        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (context) => HomePage()),
          (Route<dynamic> route) => false,
        );
      } else {
        print('Invalid token');
      }
    } catch (e) {
      print(e.toString());
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to login: ${e.toString()}'),
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
                      _obscureText =
                          !_obscureText;
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
