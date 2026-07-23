import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/test_provider.dart';

class ResultsScreen extends StatefulWidget {
  final String patientId;

  const ResultsScreen({super.key, required this.patientId});

  @override
  State<ResultsScreen> createState() => _ResultsScreenState();
}

class _ResultsScreenState extends State<ResultsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = context.read<AuthProvider>();
      if (auth.token != null) {
        context.read<TestProvider>().fetchTests(auth.token!, patientId: widget.patientId);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Test Results')),
      body: Consumer<TestProvider>(
        builder: (ctx, tp, _) {
          if (tp.loading) return const Center(child: CircularProgressIndicator());
          final completed = tp.tests.where((t) => t.status == 'completed').toList();

          if (completed.isEmpty) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.folder_open, size: 64, color: Colors.grey[300]),
                  const SizedBox(height: 16),
                  Text('No completed results yet', style: TextStyle(color: Colors.grey[600], fontSize: 16)),
                ],
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(12),
            itemCount: completed.length,
            itemBuilder: (ctx, i) {
              final t = completed[i];
              return Card(
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor: Colors.green[100],
                    child: const Icon(Icons.description, color: Colors.green),
                  ),
                  title: Text(t.testName, style: const TextStyle(fontWeight: FontWeight.w500)),
                  subtitle: Text('Completed: ${t.resultDate?.toLocal().toString().split(' ')[0] ?? 'N/A'}'),
                  trailing: TextButton(
                    onPressed: () => Navigator.pushNamed(context, '/test-detail', arguments: {'testId': t.id}),
                    child: const Text('View'),
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}