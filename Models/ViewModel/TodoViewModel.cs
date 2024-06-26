﻿using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using web_groupware.Utilities;

namespace web_groupware.Models
{
    public class TodoDetail
    {
        public int id {get; set;}
        [Column(TypeName ="nvarchar(64)")]
        public string? title { get; set; }
        public string? description { get; set; }
        [Column(TypeName = "nvarchar(1000)")]
        public string? sendUrl { get; set; }
        public int public_set {get; set;}
        public int group_set {get; set;}
        public int deadline_set {get; set;}
        public int response_status {get; set;}
        [Column(TypeName = "nvarchar(64)")]
        public string? staf_name {get; set;}
        [DataType(DataType.DateTime)]
        public DateTime? deadline_date { get; set; }
        public int? has_file { get; set; }
    }

    public class UserInfo
    {
        public string? userName { get; set; }
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

    public class TodoViewModel
    {
        public List<TodoDetail>? fileList = new List<TodoDetail>();
        public List<UserInfo>? userList = new List<UserInfo>();
        public List<T_TODO>? todoList = new List<T_TODO>();
        public int id {get; set;}
        
        public string? title { get; set; }
        [Column(TypeName = "nvarchar(64)")]
        public string? description { get; set; }
        [Column(TypeName = "nvarchar(1000)")]
        public string? sendUrl { get; set; }
        public int public_set {get; set;}
        public int group_set {get; set;}
        public int deadline_set {get; set;}
        public int response_status {get; set;}
        [Column(TypeName = "nvarchar(64)")]
        public string? staf_name {get; set;}
        [DisplayName("添付ファイル")]
        public string? Delete_files { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime? deadline_date { get; set; }
        public List<IFormFile> File { get; set; } = new List<IFormFile>();
        public TodoFileModel fileModel { get; set; } = new TodoFileModel();
        public string? work_dir { get; set; }
        public List<TodoViewModelStaff>? staffList = new();
        public int? has_file { get; set; }
        [DisplayName("宛先")]
        //[Required(ErrorMessage = Messages.REQUIRED)]
        [MinLength(1, ErrorMessage = Messages.REQUIRED)]
        public string[] MyStaffList { get; set; } = Array.Empty<string>();
        public List<StaffModel> StaffList { get; set; } = new List<StaffModel>();
        public List<EmployeeGroupModel> GroupList { get; set; } = new List<EmployeeGroupModel>();
        public string update_user { get; set; }
        public String update_date { get; set; }
        public string create_user { get; set; }
        public String create_date { get; set; }
    }

    public class TodoUpdateModel
    {

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int id { get; set; }
        public int public_set { get; set; }
        public string description { get; set; }
        public string title { get; set; }
        public int group_set { get; set; }
        public int deadline_set { get; set; }
        public int response_status { get; set; }
    }

    public class TodoCommentDetail
    {
        public int todo_no { get; set; }
        public int comment_no { get; set; }
        public string message { get; set; }
        public string update_user { get; set; }
        public String update_date { get; set; }
        public bool already_read_comment { get; set; }
        public List<T_TODOCOMMENT_FILE> CommentFileDetailList { get; set; } = new List<T_TODOCOMMENT_FILE>();

    }

    public class TodoCommentModel
    {
        public List<TodoCommentDetail>? fileList = new List<TodoCommentDetail>();
        public int id { get; set; }
        public int todo_no { get; set; }
        public int comment_no { get; set; }
        public string message { get; set; }
        public string update_user { get; set; }
        public DateTime update_date { get; set; }
        public List<T_TODOCOMMENT_FILE> CommentFileList { get; set; } = new List<T_TODOCOMMENT_FILE>();
        public List<IFormFile> File { get; set; } = new List<IFormFile>();
        public string? Delete_files { get; set; }
        public string? work_dir { get; set; }
        [DisplayName("ƒRƒƒ“ƒg")]
        [Required(ErrorMessage = Messages.REQUIRED)]
        [MaxLength(1000, ErrorMessage = Messages.MAXLENGTH)]
        public string? message_new { get; set; }
        public int? already_read_comment_no { get; set; }
    }

}