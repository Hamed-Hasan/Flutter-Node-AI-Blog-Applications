import 'package:flutter/material.dart';
import 'package:getwidget/getwidget.dart';

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
          // Content
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Spacer(),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Text(
                  'Welcome to Classroom',
                  style: TextStyle(
                    fontSize: 32,
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Text(
                  'Join over 10,000 learners over the World and enjoy online education!',
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.white,
                    fontWeight: FontWeight.normal,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
              Spacer(),
              GFButton(
                onPressed: () {/* Handle create account */},
                text: 'Create an account',
                shape: GFButtonShape.standard,
                blockButton: true,
              ),
              GFButton(
                onPressed: () {/* Handle log in */},
                text: 'Log in',
                type: GFButtonType.outline,
                shape: GFButtonShape.standard,
                blockButton: true,
              ),
              Spacer(flex: 2),
            ],
          ),
        ],
      ),
    );
  }
}
