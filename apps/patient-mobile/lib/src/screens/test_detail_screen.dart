import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/test_provider.dart';

class TestDetailScreen extends StatelessWidget {
  final String testId;

  const TestDetailScreen({super.key, required this.testId});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final test = context.watch<TestProvider>().tests.firstWhere(
      (t) => t.id == testId,
      orElse: () => throw Exception('Test not found'),
    );

    return Scaffold(
      appBar: AppBar(title: Text(test.testName)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Test Information', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 12),
                  _InfoRow(label: 'Test Name', value: test.testName),
                  _InfoRow(label: 'Status', value: test.status.replaceAll('_', ' ')),
                  _InfoRow(label: 'Ordered Date', value: test.orderedDate.toLocal().toString().split(' ')[0]),
                  if (test.resultDate != null)
                    _InfoRow(label: 'Result Date', value: test.resultDate!.toLocal().toString().split(' ')[0]),
                ],
              ),
            ),
          ),
          if (test.parameters != null && test.parameters!.isNotEmpty) ...[
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Results', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 12),
                    ...test.parameters!.map((p) => Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      child: Row(
                        children: [
                          Expanded(flex: 2, child: Text(p.name, style: const TextStyle(fontWeight: FontWeight.w500))),
                          Expanded(child: Text(p.value, textAlign: TextAlign.center)),
                          Expanded(child: Text(p.unit, textAlign: TextAlign.center, style: TextStyle(color: Colors.grey[600]))),
                          Expanded(
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: p.flag == 'normal' ? Colors.green[100] : Colors.red[100],
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                p.flag.toUpperCase(),
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontSize: 11,
                                  color: p.flag == 'normal' ? Colors.green[800] : Colors.red[800],
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    )),
                  ],
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;

  const _InfoRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Expanded(flex: 2, child: Text(label, style: TextStyle(color: Colors.grey[600]))),
          Expanded(flex: 3, child: Text(value, style: const TextStyle(fontWeight: FontWeight.w500))),
        ],
      ),
    );
  }
}