using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartCommerce.Application.Common
{
    public class Notification
    {
        public string Message { get; set; } = string.Empty;
        public NotificationType Type { get; set; } = NotificationType.Info;
        public Notification() { }
        public Notification(string message, NotificationType type)
        {
            Message = message;
            Type = type;
        }
    }

    public enum NotificationType
    {
        Success,
        Error,
        Warning,
        Info
    }

}
