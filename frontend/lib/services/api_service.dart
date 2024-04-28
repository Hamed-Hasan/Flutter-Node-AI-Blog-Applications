import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/user.dart';
import '../utils/constants.dart';

class UserService {
  Future<User> registerUser(
      String username, String password, String role) async {
    final Uri url = Uri.parse('${Constants.baseUrl}/graphql');

    // This is the GraphQL mutation formatted as a String.
    String graphqlMutation = """
    mutation RegisterUser(\$username: String!, \$password: String!, \$role: String!) {
      registerUser(username: \$username, password: \$password, role: \$role) {
        _id
        username
        role
        token
      }
    }
    """;

    final http.Response response = await http.post(
      url,
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, dynamic>{
        'query': graphqlMutation,
        'variables': {
          'username': username,
          'password': password,
          'role': role,
        },
      }),
    );

    if (response.statusCode == 200) {
      final responseBody = jsonDecode(response.body);
      if (responseBody['errors'] != null) {
        throw Exception('GraphQL Error: ${responseBody['errors']}');
      }
      return User.fromJson(responseBody['data']['registerUser']);
    } else {
      throw Exception('Failed to register user: ${response.body}');
    }
  }


  Future<User> loginUser(String email, String password) async {
    final Uri url = Uri.parse('${Constants.baseUrl}/graphql');

    // The GraphQL mutation for logging in
    String graphqlMutation = """
    mutation LoginUser(\$email: String!, \$password: String!) {
      loginUser(email: \$email, password: \$password) {
        _id
        email
        token
      }
    }
    """;

    final http.Response response = await http.post(
      url,
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, dynamic>{
        'query': graphqlMutation,
        'variables': {
          'email': email,
          'password': password,
        },
      }),
    );

    if (response.statusCode == 200) {
      final responseBody = jsonDecode(response.body);
      if (responseBody['errors'] != null) {
        throw Exception('GraphQL Error: ${responseBody['errors']}');
      }
      return User.fromJson(responseBody['data']['loginUser']);
    } else {
      throw Exception('Failed to login user: ${response.body}');
    }
  }
}
