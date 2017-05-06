#include "log.h"
#include "engine.h"

std::string Log::GetLevelString(LogLevel l)
{
    switch (l) {
    case Info:
        return std::string("[INFO]");
    case Warning:
        return std::string("[WARNING]");
    case Error:
        return std::string("[ERROR]");
    case Debug:
        return std::string("[DEBUG]");
    case Verbose:
        return std::string("[VERBOSE]");
    default:
        return std::string("");
    }
}

void Log::LogLine(Log::LogLevel key, const std::string &message, const std::string &prepend, const std::string &append)
{
    // No time needed for now
//    float currentTime = Engine::Time();
//    std::string timeTag = std::to_string(currentTime) + "s | ";
    std::string levelDenomination = GetLevelString(key);

    // Prevent logging if the current level is lower
    if(key != None && key <= currentLogLevel)
        data[key].push(prepend + levelDenomination + ": " + message + append);
}

Log::Log(std::ostream *stream) : stream(stream), data(), currentLogLevel(Error), listener(nullptr)
{
}

Log::~Log()
{
    FlushAll();
}

void Log::SetListener(LogListener *listener)
{
    this->listener = listener;
}

void Log::SetLogLevel(Log::LogLevel level)
{
    this->currentLogLevel = level;
}

void Log::LogLine(LogLevel key, const std::string &message)
{
    LogLine(key, message, "", "");
}

void Log::Flush(LogLevel key)
{
    std::queue<std::string>& lines = data[key];

    while(!lines.empty())
    {
        *stream << lines.front() << '\n';
        lines.pop();
    }

    if(listener != nullptr)
        listener->OnLogFlush();
}

void Log::FlushAll()
{
    std::unordered_map<unsigned int, std::queue<std::string> >::iterator entry;

    bool addedLines = false;

    for(entry = data.begin(); entry != data.end(); entry++)
    {
        std::queue<std::string>& lines = entry->second;

        while(!lines.empty())
        {
            addedLines = true;
            *stream << lines.front() << '\n';
            lines.pop();
        }
    }

    if(addedLines && listener != nullptr)
        listener->OnLogFlush();
}

std::ostream *Log::GetStream()
{
    return stream;
}

MultiLog::MultiLog() : Log(nullptr)
{
}

void MultiLog::AddLogger(Log *l)
{
    this->loggers.push_back(l);
}

void MultiLog::SetLogLevel(Log::LogLevel level)
{
    std::vector<Log*>::iterator l;
    for(l = loggers.begin(); l != loggers.end(); l++)
        (*l)->SetLogLevel(level);
}

void MultiLog::LogLine(Log::LogLevel key, const std::string &message)
{
    std::vector<Log*>::iterator l;
    for(l = loggers.begin(); l != loggers.end(); l++)
        (*l)->LogLine(key, message);
}

void MultiLog::Flush(Log::LogLevel key)
{
    std::vector<Log*>::iterator l;
    for(l = loggers.begin(); l != loggers.end(); l++)
        (*l)->Flush(key);

    if(listener != nullptr)
        listener->OnLogFlush();
}

void MultiLog::FlushAll()
{
    std::vector<Log*>::iterator l;
    for(l = loggers.begin(); l != loggers.end(); l++)
        (*l)->FlushAll();

    if(listener != nullptr)
        listener->OnLogFlush();
}

RichTextLog::RichTextLog(std::ostream *stream) : Log(stream)
{
}

std::string RichTextLog::GetLineColor(Log::LogLevel key)
{
    switch (key) {
    case Info:
        return std::string("#ffffff");
    case Warning:
        return std::string("#ffff00");
    case Error:
        return std::string("#ff0000");
    case Debug:
        return std::string("#0000ff");
    case Verbose:
        return std::string("#00ff00");
    default:
        return std::string("#ffffff");
    }
}

void RichTextLog::LogLine(Log::LogLevel key, const std::string &message)
{
    Log::LogLine(key, message, "<font color=\"" + GetLineColor(key) + "\">",  "</font><br>");
}
