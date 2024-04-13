import 'package:flutter/material.dart';

class MyHomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Home Page external file'),
      ),
      body: Center(
        child: Text('Welcome to the Home Page!'),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Action to perform on button click
        },
        tooltip: 'Increment',
        child: Icon(Icons.add),
      ),
    );
  }
}
