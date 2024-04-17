import 'package:flutter/material.dart';
import 'package:getwidget/getwidget.dart';
import 'login_view.dart'; 

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          // Background Image
           Image.network(
            'https://images.unsplash.com/photo-1563404203912-0b424db17de6?q=80&w=2070&auto=format&fit=crop',
            fit: BoxFit.cover,
          ),
          // Gradient Overlay
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.transparent, Colors.black54],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
            ),
          ),
          // Layout for Content
          Column(
            mainAxisAlignment: MainAxisAlignment.end, // Align content to bottom
            children: [
              // Welcome Text
              Padding(
                padding: const EdgeInsets.only(bottom: 80, left: 24, right: 24), // Adjust spacing
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start, // Align text to start
                  children: [
                    Text(
                      'Welcome to Classroom',
                      style: TextStyle(
                        fontSize: 32,
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 8), // Spacing between title and subtitle
                    Text(
                      'Join over 10.000 learners over the World and enjoy online education!',
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.white,
                        fontWeight: FontWeight.normal,
                      ),
                    ),
                  ],
                ),
              ),
              // Buttons
              Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    GFButton(
                      onPressed: () {/* Handle create account */},
                      text: 'Create an account',
                      color: Theme.of(context).primaryColor, // Use your primary color
                      shape: GFButtonShape.pills,
                      size: GFSize.LARGE,
                      blockButton: true,
                    ),
                    SizedBox(height: 16), // Spacing between buttons
                   GFButton(
                      onPressed: () {
                        // Navigate to the login_view when the button is pressed
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (context) => login_view(),
                          ),
                        );
                      },
                      text: 'Log in',
                      type: GFButtonType.outline,
                      shape: GFButtonShape.pills,
                      size: GFSize.LARGE,
                      color: Theme.of(context).primaryColor,
                      blockButton: true,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
