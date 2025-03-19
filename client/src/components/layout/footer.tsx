import React from "react";
import { SiLinkedin, SiFacebook, SiInstagram, SiGithub } from "react-icons/si";
import { FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Social Media Links */}
          <div className="flex justify-center space-x-6">
            <a 
              href="https://linkedin.com/company/cloudsectech" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-[#0A66C2] transition-colors"
            >
              <SiLinkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a 
              href="https://twitter.com/cloudsectech" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-[#1DA1F2] transition-colors"
            >
              <FaTwitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
            <a 
              href="https://facebook.com/cloudsectech" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-[#1877F2] transition-colors"
            >
              <SiFacebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </a>
            <a 
              href="https://instagram.com/cloudsectech" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-[#E4405F] transition-colors"
            >
              <SiInstagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
            <a 
              href="https://github.com/cloudsectech" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-[#181717] transition-colors dark:hover:text-white"
            >
              <SiGithub className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
          </div>

          {/* Copyright Text */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              All Rights Reserved. {new Date().getFullYear()} | Site Created by{" "}
              <a 
                href="https://creantisworld.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Creantis World
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}