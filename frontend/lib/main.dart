import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Blog List with Search & Pagination',
      home: BlogListPage(),
    );
  }
}

class BlogListPage extends StatefulWidget {
  @override
  _BlogListPageState createState() => _BlogListPageState();
}

class _BlogListPageState extends State<BlogListPage> {
  List<Map<String, dynamic>> _allPosts = [];
  List<Map<String, dynamic>> _filteredPosts = [];
  bool _isSearching = false;
  int _currentPage = 0;
  final int _postsPerPage = 10;

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    final response = await http.get(Uri.parse('https://jsonplaceholder.typicode.com/posts'));
    final List<dynamic> posts = json.decode(response.body);

    if (response.statusCode == 200) {
      setState(() {
        _allPosts = posts.cast<Map<String, dynamic>>();
        _filteredPosts = List<Map<String, dynamic>>.from(_allPosts);
      });
    } else {
      throw Exception('Failed to load posts');
    }
  }

  void _searchPosts(String query) {
    if (query.isNotEmpty) {
      _isSearching = true;
      _filteredPosts = _allPosts.where((post) {
        return post['title'].toLowerCase().contains(query.toLowerCase()) ||
               post['body'].toLowerCase().contains(query.toLowerCase());
      }).toList();
    } else {
      _isSearching = false;
      _filteredPosts = List.from(_allPosts);
    }
    setState(() {});
  }

  List<Map<String, dynamic>> _paginatedPosts() {
    int startIndex = _currentPage * _postsPerPage;
    int endIndex = startIndex + _postsPerPage;
    return _filteredPosts.sublist(startIndex, endIndex.clamp(0, _filteredPosts.length)).cast<Map<String, dynamic>>();
  }

  void _nextPage() {
    if ((_currentPage + 1) * _postsPerPage < _filteredPosts.length) {
      setState(() {
        _currentPage++;
      });
    }
  }

  void _previousPage() {
    if (_currentPage > 0) {
      setState(() {
        _currentPage--;
      });
    }
  }

  Widget _buildSearchField() {
    return TextField(
      autofocus: true,
      decoration: InputDecoration(
        hintText: 'Search posts...',
        border: InputBorder.none,
      ),
      onChanged: _searchPosts,
    );
  }

  Widget _buildListItem(Map<String, dynamic> post) {
    return Card(
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: Colors.blue,
          child: Text(post['id'].toString()),
        ),
        title: Text(post['title']),
        subtitle: Text(
          post['body'],
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: _isSearching ? _buildSearchField() : Text('Blog List'),
        actions: [
          _isSearching
              ? IconButton(icon: Icon(Icons.cancel), onPressed: () {
                setState(() {
                  _isSearching = false;
                  _filteredPosts = List.from(_allPosts);
                });
              })
              : IconButton(icon: Icon(Icons.search), onPressed: () {
                setState(() {
                  _isSearching = true;
                });
              }),
        ],
      ),
      body: ListView.builder(
        itemCount: _paginatedPosts().length,
        itemBuilder: (context, index) {
          return _buildListItem(_paginatedPosts()[index]);
        },
      ),
      bottomNavigationBar: BottomAppBar(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            IconButton(icon: Icon(Icons.arrow_back), onPressed: _previousPage),
            Text('Page ${_currentPage + 1} of ${( _filteredPosts.length / _postsPerPage ).ceil()}'),
            IconButton(icon: Icon(Icons.arrow_forward), onPressed: _nextPage),
          ],
        ),
      ),
    );
  }
}
