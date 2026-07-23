import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/test_provider.dart';
import '../models/user.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = context.read<AuthProvider>();
      if (auth.token != null) {
        context.read<TestProvider>().fetchTests(auth.token!);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final screens = [
      _DashboardTab(),
      _TestsTab(),
      _ProfileTab(),
    ];

    return Scaffold(
      body: screens[_currentIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (i) => setState(() => _currentIndex = i),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.science_outlined), selectedIcon: Icon(Icons.science), label: 'Tests'),
          NavigationDestination(icon: Icon(Icons.person_outlined), selectedIcon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}

class _DashboardTab extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('Hello, ${auth.user?.firstName ?? ''}'),
        actions: [
          IconButton(icon: const Icon(Icons.notifications_outlined), onPressed: () {}),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Quick Stats
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Your Health Summary', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _StatItem(icon: Icons.pending_actions, label: 'Pending', value: '0', color: Colors.orange),
                      _StatItem(icon: Icons.science, label: 'In Progress', value: '0', color: Colors.blue),
                      _StatItem(icon: Icons.check_circle, label: 'Completed', value: '0', color: Colors.green),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Recent Tests
          Text('Recent Tests', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Consumer<TestProvider>(
            builder: (ctx, tp, _) {
              if (tp.loading) return const Center(child: CircularProgressIndicator());
              if (tp.tests.isEmpty) {
                return Card(
                  child: Padding(
                    padding: const EdgeInsets.all(32),
                    child: Center(
                      child: Column(
                        children: [
                          Icon(Icons.science_outlined, size: 48, color: Colors.grey[400]),
                          const SizedBox(height: 8),
                          Text('No tests yet', style: TextStyle(color: Colors.grey[600])),
                        ],
                      ),
                    ),
                  ),
                );
              }
              return Column(
                children: tp.tests.take(5).map((t) => ListTile(
                  leading: CircleAvatar(
                    backgroundColor: t.status == 'completed' ? Colors.green[100] : Colors.orange[100],
                    child: Icon(
                      t.status == 'completed' ? Icons.check_circle : Icons.pending,
                      color: t.status == 'completed' ? Colors.green : Colors.orange,
                    ),
                  ),
                  title: Text(t.testName),
                  subtitle: Text('${t.status.replaceAll('_', ' ').toUpperCase()} - ${t.orderedDate.toLocal().toString().split(' ')[0]}'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () => Navigator.pushNamed(context, '/test-detail', arguments: {'testId': t.id}),
                )).toList(),
              );
            },
          ),
        ],
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;

  const _StatItem({required this.icon, required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(icon, color: color, size: 28),
        const SizedBox(height: 4),
        Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        Text(label, style: TextStyle(fontSize: 12, color: Colors.grey[600])),
      ],
    );
  }
}

class _TestsTab extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: const Text('My Tests')),
      body: Consumer<TestProvider>(
        builder: (ctx, tp, _) {
          if (tp.loading) return const Center(child: CircularProgressIndicator());
          if (tp.tests.isEmpty) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.science_outlined, size: 64, color: Colors.grey[300]),
                  const SizedBox(height: 16),
                  Text('No tests found', style: TextStyle(color: Colors.grey[600], fontSize: 16)),
                ],
              ),
            );
          }
          return ListView.builder(
            padding: const EdgeInsets.all(12),
            itemCount: tp.tests.length,
            itemBuilder: (ctx, i) {
              final t = tp.tests[i];
              return Card(
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor: t.status == 'completed' ? Colors.green[100] : Colors.blue[100],
                    child: Icon(
                      t.status == 'completed' ? Icons.check_circle : Icons.pending,
                      color: t.status == 'completed' ? Colors.green : Colors.blue,
                    ),
                  ),
                  title: Text(t.testName, style: const TextStyle(fontWeight: FontWeight.w500)),
                  subtitle: Text('${t.status.replaceAll('_', ' ')} - ${t.orderedDate.toLocal().toString().split(' ')[0]}'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () => Navigator.pushNamed(context, '/test-detail', arguments: {'testId': t.id}),
                ),
              );
            },
          );
        },
      ),
    );
  }
}

class _ProfileTab extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const SizedBox(height: 16),
          CircleAvatar(
            radius: 40,
            backgroundColor: theme.colorScheme.primaryContainer,
            child: Text(
              '${auth.user?.firstName?[0] ?? ''}${auth.user?.lastName?[0] ?? ''}',
              style: TextStyle(fontSize: 28, color: theme.colorScheme.onPrimaryContainer),
            ),
          ),
          const SizedBox(height: 12),
          Text(auth.user?.fullName ?? '', textAlign: TextAlign.center, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          Text(auth.user?.email ?? '', textAlign: TextAlign.center, style: TextStyle(color: Colors.grey[600])),
          const SizedBox(height: 32),

          Card(
            child: Column(
              children: [
                ListTile(leading: const Icon(Icons.person_outline), title: const Text('Personal Information'), trailing: const Icon(Icons.chevron_right), onTap: () {}),
                const Divider(height: 1),
                ListTile(leading: const Icon(Icons.settings_outlined), title: const Text('Settings'), trailing: const Icon(Icons.chevron_right), onTap: () {}),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.logout, color: Colors.red),
                  title: const Text('Logout', style: TextStyle(color: Colors.red)),
                  onTap: () {
                    auth.logout();
                    Navigator.pushReplacementNamed(context, '/login');
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}