class User {
  final String id;
  final String firstName;
  final String lastName;
  final String email;
  final String? phone;
  final String role;

  User({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.email,
    this.phone,
    this.role = 'patient',
  });

  String get fullName => '$firstName $lastName';

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      firstName: json['firstName'],
      lastName: json['lastName'],
      email: json['email'],
      phone: json['phone'],
      role: json['role'] ?? 'patient',
    );
  }
}

class TestResult {
  final String id;
  final String testId;
  final String testName;
  final String status;
  final DateTime orderedDate;
  final DateTime? resultDate;
  final String? summary;
  final List<Parameter>? parameters;

  TestResult({
    required this.id,
    required this.testId,
    required this.testName,
    required this.status,
    required this.orderedDate,
    this.resultDate,
    this.summary,
    this.parameters,
  });

  factory TestResult.fromJson(Map<String, dynamic> json) {
    return TestResult(
      id: json['id'],
      testId: json['testId'] ?? '',
      testName: json['testName'] ?? json['test']?['testName'] ?? '',
      status: json['status'],
      orderedDate: DateTime.parse(json['orderedDate'] ?? json['createdAt']),
      resultDate: json['resultDate'] != null ? DateTime.parse(json['resultDate']) : null,
      summary: json['summary'],
      parameters: json['parameters'] != null
          ? (json['parameters'] as List).map((p) => Parameter.fromJson(p)).toList()
          : null,
    );
  }
}

class Parameter {
  final String name;
  final String value;
  final String unit;
  final String referenceRange;
  final String flag;

  Parameter({
    required this.name,
    required this.value,
    required this.unit,
    required this.referenceRange,
    required this.flag,
  });

  factory Parameter.fromJson(Map<String, dynamic> json) {
    return Parameter(
      name: json['name'],
      value: json['value'].toString(),
      unit: json['unit'],
      referenceRange: json['referenceRange'],
      flag: json['flag'],
    );
  }
}