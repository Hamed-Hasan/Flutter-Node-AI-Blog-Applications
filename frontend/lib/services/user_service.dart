import 'dart:convert';
import 'package:http/http.dart' as http;

import '../models/user.dart';
import '../utils/constants.dart';

class UserService {
  Future<User> registerUser(String username, String password, String role) async {
    final response = await http.post(
      Uri.parse('${Constants.baseUrl}/register'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'username': username,
        'password': password,
        'role': role,
      }),
    );

    if (response.statusCode == 200) {
      return User.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to register user');
    }
  }
}