import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/test_provider.dart';
import '../l10n/l10n.dart';
import '../main.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final locale = MedLabApp.of(context);
    final lang = locale._locale.languageCode;

    return Scaffold(
      appBar: AppBar(
        title: Text(L10n.t('welcome', lang)),
        backgroundColor: Colors.indigo,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.translate),
            onPressed: () => _showLanguagePicker(context, locale),
          ),
        ],
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            DrawerHeader(
              decoration: const BoxDecoration(
                gradient: LinearGradient(colors: [Colors.indigo, Colors.purple]),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  const CircleAvatar(
                    radius: 24,
                    backgroundColor: Colors.white,
                    child: Icon(Icons.person, color: Colors.indigo, size: 28),
                  ),
                  const SizedBox(height: 8),
                  Text(auth.user?.firstName ?? 'User', style: const TextStyle(color: Colors.white, fontSize: 16)),
                  Text(auth.user?.email ?? '', style: const TextStyle(color: Colors.white70, fontSize: 12)),
                ],
              ),
            ),
            _drawerItem(context, Icons.home, L10n.t('home', lang), '/home'),
            _drawerItem(context, Icons.science, L10n.t('tests', lang), '/home'),
            _drawerItem(context, Icons.inventory_2, L10n.t('packages', lang), '/packages'),
            _drawerItem(context, Icons.newspaper, L10n.t('news', lang), '/news'),
            _drawerItem(context, Icons.assignment, L10n.t('results', lang), '/home'),
            _drawerItem(context, Icons.person, L10n.t('profile', lang), '/profile'),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.logout),
              title: Text(L10n.t('logout', lang)),
              onTap: () {
                auth.logout();
                Navigator.pushReplacementNamed(context, '/login');
              },
            ),
          ],
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Quick Actions
            Row(
              children: [
                Expanded(child: _quickActionCard(context, Icons.science, L10n.t('book_test', lang), Colors.indigo, '/home')),
                const SizedBox(width: 12),
                Expanded(child: _quickActionCard(context, Icons.inventory_2, L10n.t('view_packages', lang), Colors.purple, '/packages')),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: _quickActionCard(context, Icons.assignment, L10n.t('my_results', lang), Colors.teal, '/home')),
                const SizedBox(width: 12),
                Expanded(child: _quickActionCard(context, Icons.newspaper, L10n.t('news', lang), Colors.orange, '/news')),
              ],
            ),
            const SizedBox(height: 24),

            // Recent Tests
            Text(L10n.t('tests', lang), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            ...List.generate(3, (i) => Card(
              margin: const EdgeInsets.only(bottom: 8),
              child: ListTile(
                leading: Container(
                  width: 40, height: 40,
                  decoration: BoxDecoration(
                    color: i == 0 ? Colors.green[50] : Colors.amber[50],
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(i == 0 ? Icons.check_circle : Icons.pending, color: i == 0 ? Colors.green : Colors.amber),
                ),
                title: Text(['Complete Blood Count', 'Lipid Profile', 'Blood Glucose'][i], style: const TextStyle(fontSize: 14)),
                subtitle: Text(['Completed - Jan 15, 2024', 'Pending - Jan 20, 2024', 'In Progress'][i], style: const TextStyle(fontSize: 12)),
                trailing: const Icon(Icons.chevron_right),
                onTap: () => Navigator.pushNamed(context, '/test-detail', arguments: {'testId': 'test-$i'}),
              ),
            )),
          ],
        ),
      ),
    );
  }

  Widget _quickActionCard(BuildContext context, IconData icon, String label, Color color, String route) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () => Navigator.pushNamed(context, route),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
          child: Column(
            children: [
              Container(
                width: 48, height: 48,
                decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(14)),
                child: Icon(icon, color: color, size: 24),
              ),
              const SizedBox(height: 8),
              Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500), textAlign: TextAlign.center),
            ],
          ),
        ),
      ),
    );
  }

  Widget _drawerItem(BuildContext context, IconData icon, String label, String route) {
    return ListTile(
      leading: Icon(icon),
      title: Text(label),
      onTap: () {
        Navigator.pop(context);
        if (route != '/home') Navigator.pushNamed(context, route);
      },
    );
  }

  void _showLanguagePicker(BuildContext context, _MedLabAppState locale) {
    showModalBottomSheet(
      context: context,
      builder: (ctx) => Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ListTile(
            leading: const Text('🇬🇧', style: TextStyle(fontSize: 24)),
            title: const Text('English'),
            onTap: () { locale.setLocale(const Locale('en')); Navigator.pop(ctx); },
          ),
          ListTile(
            leading: const Text('🇸🇦', style: TextStyle(fontSize: 24)),
            title: const Text('العربية'),
            onTap: () { locale.setLocale(const Locale('ar')); Navigator.pop(ctx); },
          ),
          ListTile(
            leading: const Text('🏳️', style: TextStyle(fontSize: 24)),
            title: const Text('کوردی سۆرانی'),
            onTap: () { locale.setLocale(const Locale('ckb')); Navigator.pop(ctx); },
          ),
          ListTile(
            leading: const Text('🏳️', style: TextStyle(fontSize: 24)),
            title: const Text('Kurmancî'),
            onTap: () { locale.setLocale(const Locale('kmr')); Navigator.pop(ctx); },
          ),
        ],
      ),
    );
  }
}