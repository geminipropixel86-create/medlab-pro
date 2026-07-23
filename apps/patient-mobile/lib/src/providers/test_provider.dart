import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../models/user.dart';

class TestProvider extends ChangeNotifier {
  List<TestResult> _tests = [];
  bool _loading = false;
  String? _error;

  List<TestResult> get tests => _tests;
  bool get loading => _loading;
  String? get error => _error;

  Future<void> fetchTests(String token, {String patientId = ''}) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      final uri = patientId.isNotEmpty
          ? Uri.parse('http://10.0.2.2:3000/api/v1/tests?patientId=$patientId&limit=50')
          : Uri.parse('http://10.0.2.2:3000/api/v1/tests?limit=50');

      final res = await http.get(
        uri,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (res.statusCode == 200) {
        final body = jsonDecode(res.body);
        final data = body['data'] as List;
        _tests = data.map((t) => TestResult.fromJson(t)).toList();
      } else {
        _error = 'Failed to load tests';
      }
    } catch (e) {
      _error = 'Connection failed';
    }

    _loading = false;
    notifyListeners();
  }
}