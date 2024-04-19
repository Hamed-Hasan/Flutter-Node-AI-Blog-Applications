class User {
  final String _id;
  final String username;
  final String role;
  final String? bio;
  final String? profilePicture;
  final SocialLinks? socialLinks;
  final String? token;

  User({
    required String id,
    required this.username,
    required this.role,
    this.bio,
    this.profilePicture,
    this.socialLinks,
    this.token,
  }) : _id = id;

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id'],
      username: json['username'],
      role: json['role'],
      bio: json['bio'],
      profilePicture: json['profilePicture'],
      socialLinks: json['socialLinks'] != null
          ? SocialLinks.fromJson(json['socialLinks'])
          : null,
      token: json['token'],
    );
  }
}

class SocialLinks {
  final String? github;
  final String? twitter;

  SocialLinks({this.github, this.twitter});

  factory SocialLinks.fromJson(Map<String, dynamic> json) {
    return SocialLinks(
      github: json['github'],
      twitter: json['twitter'],
    );
  }
}