# AJYAL: Youth Empowerment & Incentivized Learning Ledger via Pi Network SDK
# Strategic Focus: Human Capital Development and Digital Literacy in Yemen

class AjyalIncentiveSystem:
    def __init__(self):
        self.enrolled_youth = {}
        self.total_pi_grants_distributed = 0

    def register_student(self, student_id, name, track):
        """تسجيل شاب جديد في المسار التدريبي الرقمي"""
        self.enrolled_youth[student_id] = {
            "name": name,
            "track": track,
            "completed_modules": 0,
            "earned_pi_rewards": 0.0,
            "certified": False
        }
        print(f"[Ajyal System] Registered: {name} in {track} Tech Track.")

    def complete_module(self, student_id, pi_reward_per_module=50):
        """محاكاة إكمال وحدة تدريبية وتوزيع مكافأة رقمية عبر محفظة Pi"""
        if student_id not in self.enrolled_youth:
            print("[Error] Student not found.")
            return

        student = self.enrolled_youth[student_id]
        student["completed_modules"] += 1
        student["earned_pi_rewards"] += pi_reward_per_module
        self.total_pi_grants_distributed += pi_reward_per_module
        
        print(f"[Pi SDK Hook] Transferring {pi_reward_per_module} Pi to {student['name']} for completing module {student['completed_modules']}.")
        
        # منح الشهادة بعد إكمال 3 وحدات تدريبية بنجاح
        if student["completed_modules"] >= 3:
            student["certified"] = True
            print(f"[Success] {student['name']} has graduated and earned an Ajyal Blockchain Certificate!")

# تشغيل النظام التجريبي للتأكد من خلوه من الأخطاء البرمجية
if __name__ == "__main__":
    ajyal_program = AjyalIncentiveSystem()
    
    # محاكاة تسجيل وتدريب شاب يمني في تكنولوجيا الـ Web3
    ajyal_program.register_student("YEM-2026-01", "Ahmed Ali", "Blockchain Development & Pi SDK")
    
    # إكمال الوحدات تدريجياً وتلقي التمويل المصغر
    ajyal_program.complete_module("YEM-2026-01")
    ajyal_program.complete_module("YEM-2026-01")
    ajyal_program.complete_module("YEM-2026-01")
    
    print(f"\n[Global Metrics] Total Pi Grants Allocated: {ajyal_program.total_pi_grants_distributed} Pi.")
