﻿using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using web_groupware.Utilities;

namespace web_groupware.Models
{
    public class TodoModel
    {
        public int todo_no { get; set; }

        [DisplayName("タイトル")]
        [Required(ErrorMessage = Messages.REQUIRED)]
        [MaxLength(64, ErrorMessage = Messages.MAXLENGTH)]
        public string? title { get; set; }

        [DisplayName("説明")]
        public string? description { get; set; }

        public string? sendUrl { get; set; }

        [DisplayName("公開・非公開")]
        public int public_set { get; set; }

        public int group_set { get; set; }

        [DisplayName("期限")]
        public int deadline_set { get; set; }

        [DisplayName("状態")]
        public int response_status { get; set; }

        public string? staf_cd { get; set; }

        public string? deadline_date { get; set; }

        public int? has_file { get; set; }

        [DisplayName("登緑日時")]
        public string? create_date { get; set; }
    }

    public class TodoViewModelStaff
    {
        public int staff_cd { get; set; }
        public string? staff_name { get; set; }
    }

    public class TodoFileModel
    {
        public List<T_TODO_FILE> fileList { get; set; } = new List<T_TODO_FILE>();
        public int editable = 0;
    }

    public class TodoDetailModel: BaseViewModel
    {
        public int todo_no { get; set; }

        [DisplayName("タイトル")]
        [Required(ErrorMessage = Messages.REQUIRED)]
        [MaxLength(64, ErrorMessage = Messages.MAXLENGTH)]
        public string title { get; set; }

        [DisplayName("説明")]
        public string? description { get; set; }

        public string? sendUrl { get; set; }

        [DisplayName("公開・非公開")]
        public int public_set { get; set; }

        [DisplayName("期限")]
        public int deadline_set { get; set; }

        [Display(Name = "期日")]
        [DataType(DataType.DateTime)]
        public string? deadline_date { get; set; }

        [DisplayName("状態")]
        public int response_status { get; set; }

        public string? staf_cd { get; set; }

        public string? Delete_files { get; set; }

        [DisplayName("添付ファイル")]
        public List<IFormFile> File { get; set; } = new List<IFormFile>();

        public TodoFileModel fileModel { get; set; } = new TodoFileModel();

        public string? work_dir { get; set; }

        public List<TodoViewModelStaff>? staffList = new();

        [DisplayName("宛先")]
        [Required(ErrorMessage = Messages.REQUIRED)]
        [MinLength(1, ErrorMessage = Messages.REQUIRED)]
        public string[] MyStaffList { get; set; } = Array.Empty<string>();

        public List<StaffModel> StaffList { get; set; } = new List<StaffModel>();

        public List<EmployeeGroupModel> GroupList { get; set; } = new List<EmployeeGroupModel>();
        
        [DisplayName("登録者")]
        public string? create_user { get; set; }

        [DisplayName("登録日時")]
        public string? create_date { get; set; }

        [DisplayName("更新者")]
        public string? update_user { get; set; }

        [DisplayName("更新日時")]
        public string? update_date { get; set; }
    }

    public class TodoViewModel
    {
        public List<TodoModel>? fileList = new List<TodoModel>();

        [DisplayName("タイトル")]
        [Required(ErrorMessage = Messages.REQUIRED)]
        [MaxLength(64, ErrorMessage = Messages.MAXLENGTH)]
        public string? title { get; set; }

        [DisplayName("説明")]
        public string? description { get; set; }

        public string? sendUrl { get; set; }

        [DisplayName("公開・非公開")]
        public int public_set { get; set; }

        [DisplayName("期限")]
        public int deadline_set { get; set; }

        [DisplayName("状態")]
        public int response_status { get; set; }

        public string? staf_cd { get; set; }

        public string? deadline_date { get; set; }

        [DisplayName("登録日時")]
        public string? create_date { get; set; }

        public string? search_deadline_set { get; set; }

        public string? search_response_status { get; set; }

        public string? search_keyword { get; set; }
    }
}