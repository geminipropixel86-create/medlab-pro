import 'package:flutter/material.dart';
import '../l10n/l10n.dart';
import '../main.dart';

class NewsScreen extends StatelessWidget {
  const NewsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final locale = MedLabApp.of(context);
    final lang = locale._locale.languageCode;

    return Scaffold(
      appBar: AppBar(
        title: Text(L10n.t('news', lang)),
        backgroundColor: Colors.indigo,
        foregroundColor: Colors.white,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildNewsCard(
            '🏥 New Opening Hours',
            'We are now open from 7 AM to 9 PM every day to serve you better.',
            'general',
            '2024-01-15',
            Colors.blue,
          ),
          const SizedBox(height: 12),
          _buildNewsCard(
            '🎉 Special Ramadan Offer',
            'Get 25% off on all comprehensive health packages during Ramadan.',
            'offer',
            '2024-03-01',
            Colors.green,
          ),
          const SizedBox(height: 12),
          _buildNewsCard(
            '🔬 New Test Added',
            'Vitamin D and Vitamin B12 tests now available with same-day results.',
            'update',
            '2024-02-20',
            Colors.purple,
          ),
          const SizedBox(height: 12),
          _buildNewsCard(
            '💡 Health Tip: Stay Hydrated',
            'Drinking enough water is essential for accurate blood test results.',
            'health-tip',
            '2024-01-10',
            Colors.amber,
          ),
        ],
      ),
    );
  }

  Widget _buildNewsCard(String title, String desc, String category, String date, Color color) {
    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(category, style: TextStyle(fontSize: 10, color: color, fontWeight: FontWeight.bold)),
                ),
                const Spacer(),
                Text(date, style: const TextStyle(fontSize: 11, color: Colors.grey)),
              ],
            ),
            const SizedBox(height: 8),
            Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 4),
            Text(desc, style: const TextStyle(fontSize: 13, color: Colors.grey[600])),
          ],
        ),
      ),
    );
  }
}