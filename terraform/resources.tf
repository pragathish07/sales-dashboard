resource "aws_vpc" "sales_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "sales-dashboard-vpc"
  }
}

resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.sales_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "ap-south-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "sales-dashboard-public-subnet-1"
  }
}

resource "aws_subnet" "public_subnet_2" {
  vpc_id                  = aws_vpc.sales_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "ap-south-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "sales-dashboard-public-subnet-2"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.sales_vpc.id

  tags = {
    Name = "sales-dashboard-igw"
  }
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.sales_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "sales-dashboard-public-rt"
  }
}

resource "aws_route_table_association" "public_rt_assoc" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "public_rt_assoc_2" {
  subnet_id      = aws_subnet.public_subnet_2.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_security_group" "sales_sg" {
  name        = "sales-dashboard-sg"
  description = "Allow SSH and HTTP/HTTPS traffic"
  vpc_id      = aws_vpc.sales_vpc.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "sales-dashboard-sg"
  }
}

resource "aws_instance" "sales_dashboard" {
  ami                    = "ami-0e35ddab05955cf57" # Ubuntu 22.04 LTS in ap-south-1
  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.public_subnet.id
  vpc_security_group_ids = [aws_security_group.sales_sg.id]
  key_name               = "main-wsl"

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  tags = {
    Name = "sales-dashboard"
  }
}

resource "aws_eip" "sales_eip" {
  instance = aws_instance.sales_dashboard.id
  domain   = "vpc"
}

resource "aws_security_group" "alb_sg" {
  name        = "sales-dashboard-alb-sg"
  description = "Allow HTTP/HTTPS to ALB"
  vpc_id      = aws_vpc.sales_vpc.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "sales-dashboard-alb-sg"
  }
}

resource "aws_lb" "sales_alb" {
  name               = "sales-dashboard-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [aws_subnet.public_subnet.id, aws_subnet.public_subnet_2.id]

  tags = {
    Name = "sales-dashboard-alb"
  }
}

resource "aws_lb_target_group" "sales_tg" {
  name     = "sales-dashboard-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.sales_vpc.id

  health_check {
    path                = "/"
    protocol            = "HTTP"
    port                = "80"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    matcher             = "200-399"
  }

  tags = {
    Name = "sales-dashboard-tg"
  }
}

resource "aws_lb_target_group_attachment" "sales_tg_attachment" {
  target_group_arn = aws_lb_target_group.sales_tg.arn
  target_id        = aws_instance.sales_dashboard.id
  port             = 80
}

resource "aws_lb_listener" "http_listener" {
  load_balancer_arn = aws_lb.sales_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.sales_tg.arn
  }
}

output "instance_public_ip" {
  value = aws_eip.sales_eip.public_ip
}

output "alb_dns_name" {
  value = aws_lb.sales_alb.dns_name
}

