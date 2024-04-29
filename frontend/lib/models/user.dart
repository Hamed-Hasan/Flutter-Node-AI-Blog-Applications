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
    id: json['_id'] as String? ?? '',
    username: json['username'] as String? ?? '',
    role: json['role'] as String? ?? '', 
    bio: json['bio'] as String?,
    profilePicture: json['profilePicture'] as String?,
    socialLinks: json['socialLinks'] != null
        ? SocialLinks.fromJson(json['socialLinks'] as Map<String, dynamic>)
        : null,
    token: json['token'] as String?,
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